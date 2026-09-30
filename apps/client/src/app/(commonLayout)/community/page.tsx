import React from 'react';
import { Card, CardHeader, CardBody, Button, Chip } from '@nextui-org/react';
import { Users, MessageCircle, Globe } from 'lucide-react';
import Image from 'next/image';

const CommunityPage = () => {
    const communities = [
        {
            id: 1,
            name: "Web Development Hub",
            description: "A community for web developers to share knowledge and experiences",
            members: 1250,
            topics: ["JavaScript", "React", "Node.js"],
            activeDiscussions: 45,
            image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=500"
        },
        {
            id: 2,
            name: "UI/UX Design Masters",
            description: "Share and learn about modern design practices and tools",
            members: 890,
            topics: ["Design", "Figma", "User Experience"],
            activeDiscussions: 32,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500"
        },
        {
            id: 3,
            name: "Data Science Network",
            description: "Connect with data scientists and analysts worldwide",
            members: 2100,
            topics: ["Python", "Machine Learning", "Data Analysis"],
            activeDiscussions: 67,
            image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500"
        },
        {
            id: 4,
            name: "Data Science Network",
            description: "Connect with data scientists and analysts worldwide",
            members: 2100,
            topics: ["Python", "Machine Learning", "Data Analysis"],
            activeDiscussions: 67,
            image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500"
        }
    ];

    return (
  
    
                <div className=" mx-auto p-4">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-8 h-8 text-primary" />
                            <h1 className="text-3xl font-bold">Tech Communities</h1>
                        </div>
                        <p className="text-default-500 max-w-2xl">
                            Join vibrant tech communities, connect with like-minded professionals, and grow together.
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card className="bg-primary/10">
                            <CardBody className="flex flex-row items-center gap-4">
                                <Globe className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">15+</p>
                                    <p className="text-small">Active Communities</p>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="bg-success/10">
                            <CardBody className="flex flex-row items-center gap-4">
                                <Users className="w-8 h-8 text-success" />
                                <div>
                                    <p className="text-2xl font-bold">5,000+</p>
                                    <p className="text-small">Total Members</p>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="bg-warning/10">
                            <CardBody className="flex flex-row items-center gap-4">
                                <MessageCircle className="w-8 h-8 text-warning" />
                                <div>
                                    <p className="text-2xl font-bold">1,200+</p>
                                    <p className="text-small">Daily Discussions</p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Communities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {communities.map((community) => (
                            <Card key={community.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="overflow-hidden p-0">
                                    <Image
                                        src={community.image}
                                        alt={community.name}
                                        width={500}
                                        height={192}
                                        className="w-full h-48 object-cover"
                                    />
                                </CardHeader>
                                <CardBody className="p-5">
                                    <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                                    <p className="text-default-500 mb-4">{community.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {community.topics.map((topic, index) => (
                                            <Chip key={index} size="sm" color="primary" variant="flat">
                                                {topic}
                                            </Chip>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Users size={16} />
                                                <span className="text-small">{community.members}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle size={16} />
                                                <span className="text-small">{community.activeDiscussions}</span>
                                            </div>
                                        </div>
                                        <Button color="primary">
                                            Join Community
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
        
   
    );
};

export default CommunityPage;