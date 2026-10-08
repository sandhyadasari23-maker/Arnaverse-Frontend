from http.server import SimpleHTTPRequestHandler, HTTPServer


class ArnaverseHandler(SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path.split("?")[0] == "/favicon.ico":
            self.send_response(204)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return

        super().do_GET()


server = HTTPServer(("0.0.0.0", 5500), ArnaverseHandler)

print("Arnaverse server running at http://localhost:5500")

server.serve_forever()