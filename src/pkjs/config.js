module.exports = [
  {
    "type": "heading",
    "defaultValue": "Watchface Configuration"
  },
  {
    "type": "text",
    "defaultValue": "Clay with Rocky.js"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Weather Settings"
      },
      {
        "type": "input",
        "messageKey": "apikey",
        "defaultValue":"",
        "label": "API Key"
      },
      {
        "type": "toggle",
        "messageKey": "fahren",
        "defaultValue":false,
        "label": "Show Fahrenheit"
      },
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save Settings"
  }
];