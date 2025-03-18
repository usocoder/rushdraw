
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">← Back to Home</Link>
        </Button>
        
        <h1 className="text-4xl font-bold mb-8 gradient-text">Frequently Asked Questions</h1>
        
        <div className="mb-8">
          <p className="text-lg">
            Find answers to the most common questions about our property development course. If you don't see your question answered here, please don't hesitate to <Link to="/contact" className="text-blue-600 hover:underline">contact us</Link>.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">Who will benefit from this course?</AccordionTrigger>
            <AccordionContent>
              <p>This all-inclusive course is designed to cater to a wide range of individuals interested in property development, including beginners and experienced individuals aiming to commence a project within a 12-month timeframe. By enrolling in this course, you will elevate your knowledge and boost your confidence to confidently embark on your property development journey.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">When can I begin the enrolment process?</AccordionTrigger>
            <AccordionContent>
              <p>Enrolments are open now and the course commences immediately.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">How is the course presented?</AccordionTrigger>
            <AccordionContent>
              <p>The course is delivered 100% online via recorded modules and live Q&A tutorials to enable maximum knowledge absorption and ease of delivery.</p>
              <p className="mt-2">From time to time students and graduates are invited to live in-person events to promote further learning and networking.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold">How long will it take for me to complete the course? Can I fast track to complete the course quicker?</AccordionTrigger>
            <AccordionContent>
              <p>The course is thoughtfully structured in a sequential manner, consisting of 12 modules over a 6-month period. Given the extensive content, which includes live tutorials for each module and various assessments, the course cannot be expedited or fast-tracked to ensure thorough absorption of the material.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-semibold">What sets this course apart from others?</AccordionTrigger>
            <AccordionContent>
              <p>We firmly believe that our education product stands out as the best compared to other online programs. Here are our distinctive features:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Expert instructors with formal education and extensive experience provide practical "how-to" material, ensuring valuable insights rather than generic information from self-proclaimed property enthusiasts.</li>
                <li>100% online learning, with a mix of recorded and live course content designed to maximise learning and time flexibility for busy students with commitments.</li>
                <li>Up to date course content reflecting the post-Covid landscape. The development industry has changed during Covid and some rules of the game have changed.</li>
                <li>Exceptional value for money with flexible payment options, other courses charge similar to double the cost while not providing as comprehensive a course.</li>
                <li>Detailed learning of the construction process, many other courses gloss over this very important topic or simply assign it to a PM. Construction costs can be the biggest expense of a project and where the majority of cost blowouts occur hence its importance to fully understand.</li>
                <li>Our primary purpose in providing this course is to equip students with the knowledge to be self-sufficient property developers, some other courses are thinly disguised sales pitches to invest in the educator/developers future projects and cover their own equity requirements.</li>
                <li>We offer a money back guarantee, subject to conditions.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-semibold">Will I be able to complete my own projects successfully once I've completed the course?</AccordionTrigger>
            <AccordionContent>
              <p>The course is meticulously crafted to empower each student to venture into property development with confidence. By actively participating in the course, you will gain comprehensive insights into the development process and acquire practical skills necessary to initiate and complete your own projects. However, it will be your responsibility to create a strategic plan and take decisive actions to achieve your development goals. The course equips you with the knowledge and tools, but the implementation and success ultimately rely on your proactive approach and dedicated efforts.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-lg font-semibold">Will I be able to meet and network with other students during the course?</AccordionTrigger>
            <AccordionContent>
              <p>Yes, students are encouraged to attend the live Q&A tutorial sessions for each module and to interact with their classmates via a private Facebook group. We encourage further networking to enable students to share experiences, structure deals and work together on their own projects.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-semibold">Can my spouse complete the course with me?</AccordionTrigger>
            <AccordionContent>
              <p>Spouses are welcome to attend Q&A and classes with the primary enrolled student however only the person enrolled in the course will be presented with a certificate of completion upon successfully graduating the course.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-9">
            <AccordionTrigger className="text-lg font-semibold">What If I am not satisfied with the course, do you offer a Money Back Guarantee?</AccordionTrigger>
            <AccordionContent>
              <p>The course is comprehensive, covering the full lifecycle of a property development project from start to finish in detail. The course is designed to enable each and every person to successfully go out and develop their own projects.</p>
              <p className="mt-2">Students are encouraged to engage deeply with the course, educators and fellow students to get the very most out of the process.</p>
              <p className="mt-2">If a student feels the course is not delivered to the standard expected we have a money back guarantee. Conditions apply.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-10">
            <AccordionTrigger className="text-lg font-semibold">Can I get additional support on my own projects?</AccordionTrigger>
            <AccordionContent>
              <p>DPI offers additional development support as well as complete project management services on external projects at an additional cost.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-11">
            <AccordionTrigger className="text-lg font-semibold">How long do I have access to the course material for?</AccordionTrigger>
            <AccordionContent>
              <p>Students have access to the full suite of course material for 6 months after graduation. As course material is regularly updated, graduates can get continued access via an annual subscription.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-12">
            <AccordionTrigger className="text-lg font-semibold">Is there a minimum age for students to enrol?</AccordionTrigger>
            <AccordionContent>
              <p>The course is primarily designed for students aged 18 and over. However, we also welcome younger students who demonstrate suitability and maturity, subject to approval from their parent or caregiver. We believe in providing opportunities for individuals of various age groups to learn and excel in the field of property development, ensuring a supportive and inclusive learning environment for all.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="text-center mt-10">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/contact">Contact Us For More Information</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
