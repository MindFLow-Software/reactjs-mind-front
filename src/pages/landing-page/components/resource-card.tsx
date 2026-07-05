import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BRAND } from '../constants'
import './resource-card.css'

export interface ResourceCardData {
  tag: string
  image: string
  title: string
  description: string
  href: string
}

interface ResourceCardProps {
  data: ResourceCardData
  delay: number
}

export function ResourceCard({ data, delay }: ResourceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="lp-res-card group"
    >
      <div className="lp-res-image-wrap">
        <img src={data.image} alt={data.title} className="lp-res-image" />
        <div className="lp-res-image-overlay" />
      </div>

      <div className="lp-res-body">
        <div>
          <span className="lp-res-tag">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            {data.tag}
          </span>

          <h3 className="lp-res-title lp-serif">{data.title}</h3>

          <p className="lp-res-desc">{data.description}</p>
        </div>

        <div className="mt-6">
          <Link
            to={data.href}
            className="lp-res-link group/link"
            style={{ color: BRAND }}
          >
            Saiba mais
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
