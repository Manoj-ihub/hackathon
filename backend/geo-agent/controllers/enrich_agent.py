from config.db import collection
from services.geocoding import get_place_from_coords

def enrich_products_with_place():
    products = collection.find({"place": {"$in": [None, "", "Unknown Location"]}})
    count = 0

    for product in products:
        count += 1
        coords = product.get("location", {}).get("coordinates", [])
        if len(coords) == 2:
            lon, lat = coords
            place = get_place_from_coords(lat, lon)

            collection.update_one(
                {"_id": product["_id"]},
                {"$set": {"place": place}}
            )
            print(f"✅ Updated {product['_id']} with place: {place}")
    
    if count == 0:
        print("⚠️  No products found that need updating.")
    else:
        print(f"👉 Total products processed: {count}")
