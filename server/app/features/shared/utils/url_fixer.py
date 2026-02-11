def fix_urls(data, base_url):
    """
    Rekurzivno prolazi kroz recnik/listu i dodaje base_url na svaki image_url.
    """
    if isinstance(data, list):
        for item in data:
            fix_urls(item, base_url)
    elif isinstance(data, dict):
        for key, value in data.items():
            if key in ["image_url", "profile_picture"] and value and isinstance(value, str):
                if not value.startswith('http'):
                    data[key] = f"{base_url}{value}"
                fix_urls(value, base_url)
    return data