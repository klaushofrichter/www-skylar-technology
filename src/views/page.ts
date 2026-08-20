export function renderPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Skylar Technology LLC</title>
  <style>
    body {
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    h1 {
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
      padding: 0 1.5rem;
    }
  </style>
</head>
<body>
  <h1>Welcome to Skylar Technology LLC</h1>
</body>
</html>
`;
}
