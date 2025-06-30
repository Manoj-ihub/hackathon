from langchain.tools import tool
import requests

@tool
def reverse_geocode_tool(coords: str) -> str:
    """Takes coordinates as a comma-separated string and returns the place name using OpenStreetMap."""
    try:
        lat, lon = map(float, coords.strip().split(","))
        response = requests.get("https://nominatim.openstreetmap.org/reverse", params={
            "lat": lat,
            "lon": lon,
            "format": "json"
        }, headers={"User-Agent": "LangChainAgent/1.0"})
        data = response.json()
        return data.get("display_name", "Unknown Location")
    except Exception as e:
        return f"Error: {str(e)}"
