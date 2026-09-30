// "use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { ChartBar, Edit, FileText, Heart } from "lucide-react";
// import { Chat, FileText, Heart, Edit } from "lucide-react"; // Added Chat import

const activities = [
  {
    id: 1,
    action: "Posted a new article",
    date: "2024-10-01",
    description: "Exploring the latest trends in technology.",
    icon: <FileText className="text-blue-500" />, // Updated icon
  },
  {
    id: 2,
    action: "Commented on Post B",
    date: "2024-09-30",
    description: "Great insights! I really enjoyed this post.",
    icon: <ChartBar className="text-green-500" />, // Chat icon added correctly
  },
  {
    id: 3,
    action: "Liked Post A",
    date: "2024-09-29",
    description: "Appreciating the excellent work!",
    icon: <Heart className="text-red-500" />,
  },
  {
    id: 4,
    action: "Updated profile information",
    date: "2024-09-28",
    description: "Changed my profile picture and bio.",
    icon: <Edit className="text-purple-500" />,
  },
  {
    id: 5,
    action: "Posted a comment on Post C",
    date: "2024-09-27",
    description: "Looking forward to the next update.",
    icon: <ChartBar className="text-green-500" />,
  },
  // Add more activities as needed
];

const ActivityPage = () => {
  return (
    <div className="container mx-auto p-6 bg-default-50 shadow-lg rounded-lg">
      <h1 className="text-2xl  mb-6 border-l-5 border-primary font-bold pl-5">Recent Activities</h1>

      <div className="space-y-4">
        {activities?.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow duration-300">
            <CardBody className="flex items-start gap-4">
              <div className="flex-shrink-0">{activity.icon}</div>
              <div>
                <CardHeader className="flex justify-between">
                  <span className="font-semibold">{activity.action}</span>
                  <span className="text-sm text-default-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </CardHeader>
                <p className="text-default-700">{activity.description}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;

