import {
  Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "app/theme/components/ui/accordion"
import EducationList from "./education-list"
import ExperienceList from "./experience-list"
import CertificationList from "./certification-list"
import { BookText , Briefcase, FileBadge, Code} from "lucide-react"
import { Badge } from "app/theme/components/ui/badge"
import TechnologyList from "./technology-list"
  export function ProfileAccordion() {
    return (
      <Accordion type="multiple"  className="w-full" 
      defaultValue={["certification"]}
      >
        <AccordionItem value="education" >
        <AccordionTrigger>
          <div className="flex justify-between items-center space-x-3  text-sm">
            <div className="flex items-center">
              <BookText className="mr-2 h-4 w-4" />
              <span>Education</span>
            </div>
              <Badge variant="outline">3</Badge>
          </div>
        </AccordionTrigger>

          <AccordionContent>
            <EducationList/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="work">

          <AccordionTrigger>
          <div className="flex justify-between items-center space-x-3 text-sm">
            <div className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Work Experience</span>
            </div>
              <Badge variant="outline">2</Badge>
          </div>
        </AccordionTrigger>
          <AccordionContent>
            <ExperienceList/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="certification">
        <AccordionTrigger >
          <div className="flex justify-between items-center space-x-3 text-sm">
            <div className="flex items-center">
            <FileBadge className="mr-2 h-4 w-4" />
            <span>License & Certification</span>
            </div>
              <Badge variant="outline">19</Badge>
          </div>
        </AccordionTrigger>
          <AccordionContent>
            <CertificationList/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tech">
        <AccordionTrigger>
          <div className="flex justify-between items-center space-x-3 text-sm">
            <div className="flex items-center">
            <Code  className="mr-2 h-4 w-4" />
            <span>Technology Stack</span>
            </div>
              <Badge variant="outline">40</Badge>
          </div>
        </AccordionTrigger>
          <AccordionContent>
            <TechnologyList/>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  