export default function Home() {
  return null;
}

export async function getServerSideProps() {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0; url=/index.html">
    <title>Redirecting...</title>
</head>
<body>
    <script>window.location.href = '/index.html';</script>
</body>
</html>`;

  return {
    props: {},
  };
}