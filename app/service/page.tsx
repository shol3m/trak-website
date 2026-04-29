import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceCard from '@/components/ui/ServiceCard'
import ServiceBookingCTA from '@/components/ui/ServiceBookingCTA'
import { mockServices } from '@/lib/mock-data'

export const metadata = {
  title: 'Услуги автосервиса — ТРАК',
  description: 'Профессиональный ремонт и техническое обслуживание ВАЗ, ГАЗ, УАЗ, КАМАЗ в Уфе',
}

const groups = ['ТО и масла', 'Диагностика', 'Ходовая', 'Двигатель'] as const

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-bg-page py-20">
      <Container>
        <SectionHeading
          title="Услуги автосервиса"
          subtitle="Опытные мастера и современное оборудование. Работаем с ВАЗ, ГАЗ, УАЗ и КАМАЗ. Гарантия на все виды работ."
        />

        <div className="flex flex-col gap-12 mb-16">
          {groups.map((group) => {
            const services = mockServices.filter((s) => s.group === group)
            return (
              <div key={group}>
                <h2 className="font-heading text-xl uppercase tracking-widest text-text-base mb-4 pb-2 border-b border-ui-border">
                  {group}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {services.map((service, i) => (
                    <ServiceCard key={service.id} service={service} index={i} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <ServiceBookingCTA />
      </Container>
    </main>
  )
}
