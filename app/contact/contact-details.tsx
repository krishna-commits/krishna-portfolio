import { Card } from 'app/theme/components/ui/card'
import { Mail, MapPinned, Phone } from 'lucide-react'

export default function ContactDetail() {
    return (
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1] mb-3">
              Get In Touch
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-light max-w-3xl leading-relaxed">
              Whether it's about your next project, tech questions, or just a friendly chat – I'm here for you!
            </p>
          </div>

          <Card className='py-8 shadow-sm border-slate-200 dark:border-slate-800'>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 text-center lg:grid-cols-3">
                <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                  <div className="mx-auto p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    <Mail className='h-6 w-6' />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">Email</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Available upon request</p>
                </div>
                <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                  <div className="mx-auto p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    <Phone className='h-6 w-6' />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">Phone</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Available upon request</p>
                </div>
                <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                  <div className="mx-auto p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    <MapPinned className='h-6 w-6' />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">Location</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Kathmandu, Nepal</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
    )
}
