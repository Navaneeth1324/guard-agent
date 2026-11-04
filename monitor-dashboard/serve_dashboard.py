import http.server
import os

PORT = 8091
HTML_FILE = os.path.join(os.path.dirname(__file__), "index.html")

class DashboardHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        with open(HTML_FILE, "rb") as f:
            self.wfile.write(f.read())

if __name__ == "__main__":
    print(f"Starting GuardAgent Dashboard on http://127.0.0.1:{PORT}/dashboard ...")
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), DashboardHandler)
    server.serve_forever()
