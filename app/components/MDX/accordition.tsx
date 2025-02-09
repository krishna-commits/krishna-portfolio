// components/Accordion.js
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'app/theme/components/ui/accordion';
import { ChevronRight } from 'lucide-react'; // Adjust based on your icon library
import { Button } from 'app/theme/components/ui/button'; // Assuming you have a Button component

export default function SkillAccordion(){
  return (
    <Accordion type="single" className="w-full" collapsible>
    <AccordionItem value="item-1" className="">
        <AccordionTrigger className=" ">Foundation of Articulation</AccordionTrigger>
        <AccordionContent className="text-md">
            <p className="font-normal pb-3 text-muted-foreground">
                Goal: Develop awareness of speech patterns, fillers, and improve clarity.
                Skill Lab is a dedicated space where I document my journey of mastering new skills, sharing insights, progress, and resources as I grow in each area of expertise.
            </p>
            <div className="grid gap-2">
                <div className="flex items-center gap-3 border-b py-3">
                    <div className="grid gap-2 ">
                        <p className="text-md font-medium leading-none">The Art of Listening</p>
                        <p className="text-sm text-muted-foreground">
                            Watch or listen to an articulate speaker (e.g., Jordan Peterson) for 15 minutes, focusing entirely on their delivery, not just the content.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-3 border-b py-3">
                    <div className="grid gap-2 ">
                        <p className="text-md font-medium leading-none">The Art of Listening</p>
                        <p className="text-sm text-muted-foreground">
                            Watch or listen to an articulate speaker (e.g., Jordan Peterson) for 15 minutes, focusing entirely on their delivery, not just the content.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-3 py-3">
                    <div className="grid gap-2 ">
                        <p className="text-md font-medium leading-none">The Art of Listening</p>
                        <p className="text-sm text-muted-foreground">
                            Watch or listen to an articulate speaker (e.g., Jordan Peterson) for 15 minutes, focusing entirely on their delivery, not just the content.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

            </div>

        </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-1" className="">
        <AccordionTrigger className=" ">Foundation of Articulation</AccordionTrigger>
        <AccordionContent className="text-md">
            <p className="font-normal pb-3 text-muted-foreground">
                Goal: Develop awareness of speech patterns, fillers, and improve clarity.
                Skill Lab is a dedicated space where I document my journey of mastering new skills, sharing insights, progress, and resources as I grow in each area of expertise.
            </p>
            <div className="grid gap-2">
                <div className="flex items-center gap-3 border-b py-3">
                    <div className="grid gap-2 ">
                        <p className="text-md font-medium leading-none">The Art of Listening</p>
                        <p className="text-sm text-muted-foreground">
                            Watch or listen to an articulate speaker (e.g., Jordan Peterson) for 15 minutes, focusing entirely on their delivery, not just the content.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-3 border-b py-3">
                    <div className="grid gap-2 ">
                        <p className="text-md font-medium leading-none">The Art of Listening</p>
                        <p className="text-sm text-muted-foreground">
                            Watch or listen to an articulate speaker (e.g., Jordan Peterson) for 15 minutes, focusing entirely on their delivery, not just the content.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-3 py-3">
                    <div className="grid gap-2 ">
                        <p className="text-md font-medium leading-none">The Art of Listening</p>
                        <p className="text-sm text-muted-foreground">
                            Watch or listen to an articulate speaker (e.g., Jordan Peterson) for 15 minutes, focusing entirely on their delivery, not just the content.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

            </div>

        </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-1" className="">
        <AccordionTrigger className=" ">Foundation of Articulation</AccordionTrigger>
        <AccordionContent className="text-md">
            <p className="font-normal pb-3 text-muted-foreground">
                Goal: Develop awareness of speech patterns, fillers, and improve clarity.
                Skill Lab is a dedicated space where I document my journey of mastering new skills, sharing insights, progress, and resources as I grow in each area of expertise.
            </p>
            <div className="grid gap-2">
                <div className="flex items-center gap-3 border-b py-3">
                    <div className="grid gap-2 ">
                        <p className="text-md font-medium leading-none">The Art of Listening</p>
                        <p className="text-sm text-muted-foreground">
                            Watch or listen to an articulate speaker (e.g., Jordan Peterson) for 15 minutes, focusing entirely on their delivery, not just the content.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-3 border-b py-3">
                    <div className="grid gap-2 ">
                        <p className="text-md font-medium leading-none">The Art of Listening</p>
                        <p className="text-sm text-muted-foreground">
                            Watch or listen to an articulate speaker (e.g., Jordan Peterson) for 15 minutes, focusing entirely on their delivery, not just the content.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-3 py-3">
                    <div className="grid gap-2 ">
                        <p className="text-md font-medium leading-none">The Art of Listening</p>
                        <p className="text-sm text-muted-foreground">
                            Watch or listen to an articulate speaker (e.g., Jordan Peterson) for 15 minutes, focusing entirely on their delivery, not just the content.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </AccordionContent>
    </AccordionItem>
</Accordion>
  );
};

