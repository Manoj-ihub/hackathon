import requests

def get_place_from_coords(lat, lon):
    try:
        response = requests.get("https://nominatim.openstreetmap.org/reverse", params={
            "lat": lat,
            "lon": lon,
            "format": "json"
        }, headers={"User-Agent": "CampusEventsAgent/1.0"})
        data = response.json()
        return data.get("display_name", "Unknown Location")
    except Exception as e:
        print("Error during reverse geocoding:", e)
        return "Unknown Location"