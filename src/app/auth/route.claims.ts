export default {
    "Routes": [
        {
            "routeUrl": "/",
            "signInRequired": "false",
            "claims": []
        },
        {
            "routeUrl": "/profile",
            "signInRequired": "true",
            "claims": []
        },
        {
            "routeUrl": "/queue",
            "signInRequired": "true",
            "claims": ["shareholder"]
        }
    ]
}