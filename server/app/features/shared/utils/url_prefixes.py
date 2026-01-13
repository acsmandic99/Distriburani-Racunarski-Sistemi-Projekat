def join_url_prefixes(*prefixes: str) -> str:
    """Join multiple URL prefixes into a single URL prefix.
    Ensures that there are no duplicate slashes and that the result starts with a single slash.
    
    Args:
        *prefixes (str): URL prefixes to join.
        
        Returns:
        str: The joined URL prefix.

    Example:
        >>> join_url_prefixes('/api/v1', '/users')
        results in '/api/v1/users'
    """
    return '/' + '/'.join(prefix.strip('/') for prefix in prefixes if prefix)