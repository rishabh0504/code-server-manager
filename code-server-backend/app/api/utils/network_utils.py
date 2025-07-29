import socket

def get_safe_port() -> int:
    """Ask OS for an unused port and close it."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))  # Bind to any available port
        port = s.getsockname()[1]  # Get port while socket is open
    return port
