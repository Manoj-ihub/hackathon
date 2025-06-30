# main.py
from controllers.run_agent import enrich_collection_with_place
import schedule
import time

def job():
    print("Running GeoAgent background job...")
    enrich_collection_with_place("products")
    enrich_collection_with_place("orders")

schedule.every(5).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
