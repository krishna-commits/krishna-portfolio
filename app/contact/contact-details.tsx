import { Card } from 'app/theme/components/ui/card'
import { Mail, MapPinned, Phone } from 'lucide-react'

export default function ContactDetail() {
    return (
        <div>
          <h1 className="dark:text-foreground text-cyan-900 font-normal font-serif text-3xl">                Reach Out and Let's Create Together
            </h1>
            <p className="mt-1 mb-8 text-md tracking-tight  dark:text-muted-foreground text-slate-500 font-serif ">
                Whether it's About Your Next Project, Tech Questions, or Just a Friendly Chat – I'm Here for You!
            </p>

            <Card className='mt-3 py-6 mb-5 shadow-none border-slate-300'>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3 content-center">
                        <div className="mx-auto flex max-w-xs flex-col gap-y-1">
                            <Mail className='mx-auto block text-center text-cyan-950 h-10 w-10' />
                            <h1 className="text-md tracking-tight  dark:text-muted-foreground text-muted-foreground font-serif">Upon Request</h1>
                        </div>
                        <div className="mx-auto flex max-w-xs flex-col gap-y-2">
                            <Phone className='mx-auto block text-center text-cyan-950 h-10 w-10' />
                            <h1 className="text-md tracking-tight  dark:text-muted-foreground text-muted-foreground font-serif">Upon Request</h1>
                        </div>
                        <div className="mx-auto flex max-w-xs flex-col gap-y-1">
                            <MapPinned className='mx-auto block text-center text-cyan-950 h-10 w-10 mb-2' />
                            <h1 className="text-md tracking-tight  dark:text-muted-foreground text-muted-foreground font-serif">Kathmandu,Nepal</h1>                            
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}