"use client"

/**
 * Rezerva ako pukne SAM korijenski okvir.
 *
 * Zato nosi vlastiti <html> i <body> i ne zavisi ni od jednog provajdera,
 * fonta ni Tailwind klase — u trenutku kad se ovo prikaže, moguće je da
 * ništa od toga nije stiglo. Stilovi su namjerno inline.
 */
export default function GlobalnaGreska({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="sl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>
            Nekaj je šlo narobe
          </h1>
          <p style={{ marginTop: "1rem", opacity: 0.75, maxWidth: "34rem" }}>
            Poskusite znova ali se vrnite na začetno stran.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "1rem",
              border: "none",
              background: "#E63946",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Poskusi znova
          </button>
        </div>
      </body>
    </html>
  )
}
