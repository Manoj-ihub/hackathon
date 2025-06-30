import schedule
import time
from controllers.enrich_agent import enrich_products_with_place

def job():
    print("Running GeoAgent background job...")
    enrich_products_with_place()

schedule.every(5).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
