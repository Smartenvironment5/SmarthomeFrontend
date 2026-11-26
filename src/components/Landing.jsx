export function Logo() {
  return (
    <span className="logo">
      <span className="logo-dot"><span /></span>
      Smart Home
    </span>
  )
}

export default function Landing({ onLogin }) {
  return (
    <div className="page">
      <div className="hero stripes">
        <div className="hero-fade" />
        <nav className="hero-nav">
          <Logo />
          <button className="btn-dark" onClick={onLogin}>Inloggen</button>
        </nav>
        <div className="hero-body">
          <div className="hero-text">
            <h1>Wij zijn<br />Smart Home</h1>
            <p>Inzicht in temperatuur, luchtvochtigheid en luchtdruk van je omgeving.</p>
            <button className="btn-primary" onClick={onLogin}>Inloggen</button>
          </div>
          <div className="hero-card">
            <div className="eyebrow">Wie wij zijn</div>
            <p>
              Smart Home verzamelt data van sensoren in huis. Je ziet in één oogopslag de temperatuur,
              luchtvochtigheid en luchtdruk per kamer. Is een waarde te hoog of te laag? Dan zie je dat
              meteen op het dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
