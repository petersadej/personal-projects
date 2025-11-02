#!/usr/bin/env python3
"""
Simple HTTP server for NaNoWriMo Progress Tracker
Handles CSV file operations for storing progress data
"""

import http.server
import socketserver
import json
import csv
import os
from urllib.parse import urlparse, parse_qs
from datetime import datetime

class NanoWrimoHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.csv_file = 'progress.csv'
        super().__init__(*args, **kwargs)

    def do_GET(self):
        parsed_path = urlparse(self.path)

        if parsed_path.path == '/api/load':
            self.handle_load_data()
        else:
            # Serve static files (HTML, CSS, JS)
            super().do_GET()

    def do_POST(self):
        parsed_path = urlparse(self.path)

        if parsed_path.path == '/api/save':
            self.handle_save_data()
        else:
            self.send_error(404)

    def handle_load_data(self):
        """Load progress data from CSV file"""
        try:
            if os.path.exists(self.csv_file):
                with open(self.csv_file, 'r', newline='', encoding='utf-8') as file:
                    content = file.read()

                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
            else:
                # Return empty response if file doesn't exist
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'')

        except Exception as e:
            print(f"Error loading data: {e}")
            self.send_error(500, f"Error loading data: {str(e)}")

    def handle_save_data(self):
        """Save progress data to CSV file"""
        try:
            # Get content length and read the data
            content_length = int(self.headers['Content-Length'])
            csv_data = self.rfile.read(content_length).decode('utf-8')

            # Write to CSV file
            with open(self.csv_file, 'w', newline='', encoding='utf-8') as file:
                file.write(csv_data)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = json.dumps({'status': 'success', 'message': 'Data saved successfully'})
            self.wfile.write(response.encode('utf-8'))

            print(f"Progress data saved at {datetime.now()}")

        except Exception as e:
            print(f"Error saving data: {e}")
            self.send_error(500, f"Error saving data: {str(e)}")

    def do_OPTIONS(self):
        """Handle preflight requests for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def end_headers(self):
        # Add CORS headers to all responses
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server(port=8000):
    """Start the HTTP server"""
    try:
        with socketserver.TCPServer(("", port), NanoWrimoHandler) as httpd:
            print(f"🚀 NaNoWriMo Tracker Server running at http://localhost:{port}")
            print(f"📁 CSV data will be saved to: {os.path.abspath('progress.csv')}")
            print("Press Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Happy writing!")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use. Try a different port:")
            print(f"   python server.py {port + 1}")
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    import sys

    # Allow custom port as command line argument
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ Invalid port number. Using default port 8000.")

    run_server(port)
