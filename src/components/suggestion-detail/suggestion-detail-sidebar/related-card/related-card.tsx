import './related-card.css'

const MOCK_RELATED = [
  { votes: 312, title: 'Transcrição automática de sessões' },
  { votes: 204, title: 'App mobile para pacientes' },
  { votes: 87, title: 'Relatórios de evolução automáticos' },
]

export function RelatedCard() {
  return (
    <div className="sdm-card sdm-related-card">
      <span className="sdm-card-label">Relacionadas</span>
      <div className="sdm-related-list">
        {MOCK_RELATED.map((related) => (
          <button key={related.title} type="button" className="sdm-related">
            <span className="sdm-related-votes">{related.votes}</span>
            <span className="sdm-related-title">{related.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
