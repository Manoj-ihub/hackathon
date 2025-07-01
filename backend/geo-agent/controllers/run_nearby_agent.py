# geo-agent/controllers/run_nearby_agent.py

import sys
import os
import json
from dotenv import load_dotenv
from bson import json_util  # ✅ Handles ObjectId and datetime

# ✅ Load environment variables
load_dotenv()

# ✅ Add project root to sys.path so we can import `tools.*`
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# ✅ Import the LangChain tool directly (not the LLM agent)python controllers/run_nearby_agent.py 11.075584 76.9851392 sabari@gmail.com

from tools.nearby_orders_tool import nearby_orders_tool

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({ "error": "Usage: python run_nearby_agent.py <lat> <lon> <email>" }))
        sys.exit(1)

    lat, lon, email = sys.argv[1], sys.argv[2], sys.argv[3]
    coords_str = f"{lat},{lon},{email}"

    try:
        # ✅ Call the tool directly
        result = nearby_orders_tool.invoke(coords_str)

        # ✅ Output safe JSON (handles ObjectId, datetime, etc.)
        print(json_util.dumps(result))

    except Exception as e:
        print(json.dumps({ "error": f"Tool invocation failed: {str(e)}" }))
        sys.exit(1)
