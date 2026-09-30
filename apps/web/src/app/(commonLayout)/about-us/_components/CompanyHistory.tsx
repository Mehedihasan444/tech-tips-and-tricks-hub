"use client";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Image from "next/image";
import missionImage from "@/assets/mission-image.jpeg";

const CompanyHistory = () => {
  
  return (
    <section className="max-w-7xl lg:mx-auto lg:h-screen my-10 lg:my-0 mx-5 flex justify-between items-center">
      <div className="lg:flex justify-between items-center gap-10 space-y-5">
        <div className="flex-1">
          <Image
            src={missionImage}
            alt="Tech community"
            height={400}
            width={400}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h2 className=" text-4xl font-extrabold  mb-6 text-center border-b-4 border-teal-500 inline-block pb-2">
            Our Journey
          </h2>
          <p className="text-lg leading-relaxed ">
            Tech Tips & Tricks Hub started in 2024 with a vision to create an
            inclusive platform where tech enthusiasts could share and access
            practical knowledge, tips, and tutorials. From humble beginnings,
            we have grown into a community-driven hub for tech insights,
            product reviews, and expert advice.
          </p>
          <div className="flex flex-col mt-6">
            <Tabs aria-label="Options" color={"primary"} >
              <Tab key="photos" title="Photos">
                <Card>
                  <CardBody>
                    Explore our gallery of tutorials, workshops, and tech
                    gatherings from the early days of our journey.
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="achievements" title="Achievements">
                <Card>
                  <CardBody>
                    From launching our first tutorial to reaching 100,000 users,
                    take a look at our milestones.
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyHistory;
