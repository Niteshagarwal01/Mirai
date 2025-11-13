# AI Voice Agent Order Confirmation System

A comprehensive n8n workflow that automatically calls customers to confirm order details using AI-powered voice technology. This system provides natural, human-like conversations while seamlessly handling order confirmations, changes, and escalations.

## 🚀 Features

- **Automated Voice Calls**: Calls customers automatically after order placement
- **Natural Conversations**: AI-powered voice agent with human-like interactions
- **Order Confirmation**: Verifies items, delivery address, and expected delivery time
- **Intelligent Routing**: Automatically escalates to human agents when needed
- **Multi-Platform Integration**: Works with Shopify, WooCommerce, Magento, BigCommerce, and custom platforms
- **Real-time Monitoring**: Comprehensive analytics and call outcome tracking
- **Retry Logic**: Automatically retries failed calls up to 3 times
- **Support Integration**: Creates tickets in Zendesk and sends Slack notifications
- **Sentiment Analysis**: Tracks customer sentiment during conversations
- **Flexible Scheduling**: Supports immediate and scheduled call execution

## 📋 Prerequisites

- n8n instance (self-hosted or cloud)
- PostgreSQL database
- Retell AI account
- Zendesk account (optional)
- Slack workspace (optional)
- E-commerce platform with webhook support

## 🛠️ Installation

### 1. Database Setup

First, create the required database schema:

```sql
-- Run the provided schema.sql file
psql -U username -d database_name -f schema.sql
```

### 2. n8n Workflow Import

1. Open your n8n instance
2. Click "Import from file" 
3. Upload the `voice-agent-workflow.json` file
4. The workflow will be imported with all nodes and connections

### 3. Configure Credentials

Set up the following credentials in n8n:

#### PostgreSQL Database
- **Name**: `postgres-main-db`
- **Host**: Your database host
- **Database**: Your database name
- **Username**: Database username
- **Password**: Database password

#### Retell AI API
- **Name**: `retell-ai-credentials`
- **API Key**: Your Retell AI API key
- **Base URL**: `https://api.retellai.com/v1`

#### Zendesk API (Optional)
- **Name**: `zendesk-support`
- **Subdomain**: Your Zendesk subdomain
- **Email**: Your Zendesk email
- **API Token**: Your Zendesk API token

### 4. Configure Store Settings

Update the "Store Config" node with your information:

```javascript
{
  "store_name": "Your Store Name",
  "business_phone": "+1234567890",
  "support_email": "support@yourstore.com",
  "slack_webhook_url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
}
```

### 5. Set Up Retell AI Agent

Create an agent in Retell AI with the following configuration:

```json
{
  "agent_name": "Order Confirmation Agent",
  "agent_id": "agent_order_confirmation",
  "voice_id": "your-elevenlabs-voice-id",
  "language": "en-US",
  "webhook_url": "https://your-n8n-instance.com/webhook/call-webhook"
}
```

## 🔧 Configuration

### Webhook Endpoints

The workflow exposes these webhook endpoints:

- **Order Placed**: `https://your-n8n-instance.com/webhook/order-placed`
- **Call Status**: `https://your-n8n-instance.com/webhook/call-webhook`
- **Retry Failed Calls**: `https://your-n8n-instance.com/webhook/retry-failed-calls`

### E-commerce Integration

#### Shopify
Add webhook in Shopify admin:
- **Event**: Order creation
- **URL**: `https://your-n8n-instance.com/webhook/order-placed`
- **Format**: JSON

#### WooCommerce
Add to your `functions.php`:

```php
function trigger_voice_confirmation($order_id) {
    $order = wc_get_order($order_id);
    // Implementation provided in integration examples
}
add_action('woocommerce_order_status_processing', 'trigger_voice_confirmation');
```

#### Custom Integration
Send POST request to the webhook with order data:

```javascript
const orderData = {
  order_id: "12345",
  customer_name: "John Doe",
  customer_phone: "+1234567890",
  order_items: [
    {
      name: "Product Name",
      quantity: 1,
      price: 99.99
    }
  ],
  delivery_address: "123 Main St, City, State 12345",
  expected_delivery: "2024-12-25T10:00:00Z",
  order_total: 99.99
};

fetch('https://your-n8n-instance.com/webhook/order-placed', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

## 📊 Monitoring and Analytics

### Database Views

The system includes analytical views for monitoring:

```sql
-- View call statistics
SELECT * FROM order_confirmation_analytics;

-- Check current status distribution
SELECT status, COUNT(*) as count 
FROM order_confirmations 
GROUP BY status;

-- Success rate over time
SELECT DATE(created_at) as date,
       COUNT(CASE WHEN status = 'confirmed' THEN 1 END) * 100.0 / COUNT(*) as success_rate
FROM order_confirmations 
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Health Check Endpoint

Monitor system health:

```bash
curl https://your-app.com/voice-agent/health
```

Response:
```json
{
  "status": "healthy",
  "success_rate": 85.5,
  "today_stats": {
    "total_orders": 45,
    "confirmed": 38,
    "no_answer": 4,
    "human_requested": 3
  },
  "timestamp": "2024-12-20T10:30:00Z"
}
```

## 🔄 Workflow Components

### Core Nodes

1. **Order Placed Webhook**: Receives order data from e-commerce platforms
2. **Store Order Data**: Saves order information to database
3. **Schedule Checker**: Runs every minute to check for pending calls
4. **Voice Call Initiation**: Starts AI voice calls via Retell AI
5. **Call Analysis**: Analyzes conversation outcomes using AI
6. **Human Escalation**: Creates support tickets when needed
7. **Retry Logic**: Handles failed calls automatically

### Call Flow

1. Customer places order → Webhook triggered
2. Order data stored in database
3. Call scheduled (immediate or delayed)
4. AI agent calls customer
5. Conversation analyzed for outcome
6. Results logged and actions taken
7. Human escalation if needed

## 🛡️ Security

- Use HTTPS for all webhook endpoints
- Implement API key authentication
- Store sensitive data securely
- Regular security audits
- GDPR/CCPA compliance considerations

## 📈 Performance

### Optimization Tips

- Use database connection pooling
- Implement rate limiting for API calls
- Monitor API quotas and limits
- Use message queues for high volume
- Regular database maintenance

### Scaling Considerations

- **Low Volume**: Default configuration works well
- **Medium Volume**: Add connection pooling and monitoring
- **High Volume**: Consider load balancing and queue systems

## 🐛 Troubleshooting

### Common Issues

#### Calls Not Triggering
- Check webhook URL configuration
- Verify database connection
- Ensure scheduled_call_time is set correctly

#### Voice Quality Issues
- Check Retell AI voice settings
- Verify audio quality settings
- Test with different voice models

#### Database Connection Errors
- Verify PostgreSQL credentials
- Check database server status
- Ensure proper network connectivity

### Error Monitoring

Check n8n execution logs for:
- Webhook failures
- Database connection issues
- API rate limiting
- Voice call failures

## 📝 Customization

### Adding New Languages

1. Update Retell AI agent language settings
2. Modify voice prompts in workflow
3. Add language-specific phone number formatting

### Custom Call Outcomes

Modify the "Analyze Call Outcome" node to add new outcome types:

```javascript
// Add new outcome detection
if (lowerTranscript.includes('custom_keyword')) {
  outcome = 'custom_outcome';
  notes = 'Custom outcome detected';
}
```

### Integration with Other Platforms

1. Create new webhook endpoint
2. Map platform data to standard format
3. Test integration thoroughly

## 🤝 Support

### Documentation
- [n8n Documentation](https://docs.n8n.io)
- [Retell AI Documentation](https://docs.retellai.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Community
- n8n Community Forum
- GitHub Issues for bug reports
- Discord for real-time support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔄 Updates

### Version 1.0.0
- Initial release with core functionality
- Basic order confirmation workflow
- Retell AI integration
- Database schema and analytics

### Planned Features
- Multi-language support
- Advanced sentiment analysis
- Custom voice training
- Enhanced analytics dashboard
- Mobile app integration

## 🙏 Acknowledgments

- n8n team for the automation platform
- Retell AI for voice technology
- Community contributors
- Beta testers and feedback providers

---

For detailed setup instructions and advanced configuration, see the included configuration files and examples.
