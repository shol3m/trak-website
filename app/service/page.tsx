import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceCard from '@/components/ui/ServiceCard'
import ServiceBookingCTA from '@/components/ui/ServiceBookingCTA'
import { mockServices } from '@/lib/mock-data'

export const metadata = {
  title: 'Услуги автосервиса — ТРАК',
  description: 'Профессиональный ремонт и техническое обслуживание ВАЗ, ГАЗ, УАЗ, КАМАЗ в Уфе',
}

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] py-20">
      <Container>
        <SectionHeading
          title="Услуги автосервиса"
          subtitle="Опытные мастера и современное оборудование. Работаем с ВАЗ, ГАЗ, УАЗ и КАМАЗ. Гарантия на все виды работ."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {mockServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        <ServiceBookingCTA />
      </Container>
    </main>
  )
}
