export function renderPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Skylar Technology LLC</title>
  <link rel="icon" type="image/png" href="/assets/skylar-256x256.png" />
  <style>
    body {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    img {
      width: 128px;
      height: 128px;
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
      padding: 0 1.5rem;
      margin: 0;
    }
  </style>
</head>
<body>
  <img src="/assets/skylar-256x256.png" alt="Skylar Technology LLC logo" />
  <h1>Welcome to Skylar Technology LLC</h1>
</body>
</html>
`;
}
