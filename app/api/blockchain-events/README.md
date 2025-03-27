# Blockchain Events API

This service uses a Vercel Edge Function to poll blockchain events and provide them directly to clients via a simple API endpoint. The approach eliminates the need for any intermediate storage while providing real-time UI updates.

## Advantages of This Approach

1. **Simplicity**: No intermediate data storage needed
2. **Efficiency**: Only the most recent events are processed and transmitted
3. **Low Latency**: Direct API calls every 5 seconds provide near real-time updates
4. **Zero Maintenance**: Fully managed by Vercel
5. **Cost Effective**: Minimal API calls and no database costs

## How It Works

1. **Server-Side Polling**: The Edge Function runs every 5 seconds (configured in `vercel.json`)
2. **Block Tracking**: Keeps track of the last processed block to avoid duplicate events
3. **In-Memory Caching**: Caches recent events in memory
4. **Client Polling**: Clients poll the API every 5 seconds to get latest events

## Implementation Details

### Server-Side (Edge Function)

- Runs every 5 seconds via Vercel cron job
- Queries blockchain for events since the last processed block
- Returns only the new events that occurred since the last query
- Maintains a simple in-memory cache of recent events

### Client-Side

- Polls the API endpoint every 5 seconds
- Processes new events and triggers UI updates
- Maintains event subscriptions for component-specific updates

## Configuration

### 1. Environment Variables

Add these to your Vercel project:

```
# Blockchain Provider
ALCHEMY_API_URL=https://your-alchemy-endpoint.com

# Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER=0x123...
NEXT_PUBLIC_CONTRACT_ADDR_GAME_DOORS=0x456...
```

### 2. Vercel Cron Configuration

The `vercel.json` file configures the function to run every 5 seconds:

```json
{
  "crons": [
    {
      "path": "/api/blockchain-events",
      "schedule": "*/5 * * * * *"
    }
  ]
}
```

## API Response Format

```json
{
  "success": true,
  "events": [
    {
      "type": {
        "contract": "Doors",
        "event": "DoorOpened"
      },
      "data": {
        "address": "0x...",
        "args": [...],
        "blockNumber": 12345678,
        "transactionHash": "0x..."
      },
      "timestamp": 1687654321000,
      "contractAddress": "0x..."
    }
  ],
  "message": "Processed blocks 12345670 to 12345680",
  "fromBlock": 12345670,
  "latestBlock": 12345680
}
``` 