# controllers/run_agent.py
from config.db import get_collection
from agent.geo_agent import agent
from utils.logger import log

def enrich_collection_with_place(collection_name: str):
    collection = get_collection(collection_name)
    documents = collection.find({"place": {"$in": [None, "", "Unknown Location"]}})
    count = 0

    for doc in documents:
        coords = doc.get("location", {}).get("coordinates", [])
        if len(coords) == 2:
            lon, lat = coords
            prompt = f"What is the location name for latitude {lat} and longitude {lon}?"
            try:
                place = agent.run(prompt)
                collection.update_one(
                    {"_id": doc["_id"]},
                    {"$set": {"place": place}}
                )
                log(f"✅ Updated {doc['_id']} in {collection_name} with place: {place}")
                count += 1
            except Exception as e:
                log(f"❌ Failed for {doc['_id']}: {e}")
        else:
            log(f"⚠️ Skipped {doc['_id']} (invalid or missing coordinates)")

    if count == 0:
        log(f"⚠️ No {collection_name} documents found that need updating.")
    else:
        log(f"👉 Total {collection_name} documents processed: {count}")
