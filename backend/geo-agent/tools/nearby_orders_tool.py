# geo-agent/tools/nearby_orders_tool.py
from langchain.tools import tool
from pymongo import MongoClient
from geopy.distance import geodesic
import os
from dotenv import load_dotenv

load_dotenv()

@tool
def nearby_orders_tool(coords_email: str) -> list:
    """
    Takes 'lat,lon,email' string and returns pending orders within 20 km.
    """
    try:
        lat, lon, email = coords_email.split(",")
        lat, lon = float(lat), float(lon)

        client = MongoClient(os.getenv("MONGO_URI"))
        db = client[os.getenv("MONGO_DB_NAME")]
        orders = db["orders"].find({
            "status": "pending",
            "vendorEmail": None,
            "rejected": { "$ne": email }
        })

        nearby = []
        for order in orders:
            coords = order.get("location", {}).get("coordinates", [])
            if len(coords) == 2:
                order_lon, order_lat = coords
                distance = geodesic((lat, lon), (order_lat, order_lon)).km
                if distance <= 20:
                    order["_id"] = str(order["_id"])
                    nearby.append(order)

        return nearby if nearby else "No nearby pending orders."
    except Exception as e:
        return f"Error: {str(e)}"
