"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@nextui-org/card";
import { CardHeader } from "@nextui-org/card";
import { CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Code } from "@nextui-org/code";
import { SearchIcon } from "@/components/icons";
import TagInput from "@/components/TagInput";
import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import axios from "axios";
import { Chip } from "@nextui-org/chip";
import Slideshow from "@/components/autoslide";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState("");
  const [searchTag , setSearchTag] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/GetPost")
      .then((response) => {
        console.log(response.data);
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const filteredPosts = posts
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];


  const [tags, setTags] = useState<string[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const newTag = event.currentTarget.value.trim();
      console.log(newTag);
      if (newTag) {
        setTags([...tags, newTag]);
        event.currentTarget.value = "";
        handleTagSearch(newTag);
      }
    }
  };

  const handleTagSearch = async (newTag: string) => {
    try {
      const response = await axios.post("http://localhost:8000/api/Search", { tag: newTag });
      setSearchTag(response.data)
    } catch (error) {
      console.error("Error searching for posts by tag:", error);
    }
  };


  

  const handleDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  //const [selected, setSelected] = useState([]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full ">
      <div className="flex w-full h-full ">
        <Card className="w-1/4 flex  rounded-xl border-gray-500 bg-blend-normal border-2 h-full flex-col items-center rounded-r-none">
          <Input
            aria-label="Search"
            classNames={{
              inputWrapper: "w-128 h-14 bg-white border-2 border-gray-800",
              input: "text-sm",
            }}
            labelPlacement="outside"
            placeholder="Search..."
            startContent={
              <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="search"
            className="w-4/5 mt-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Card className="box-anim m-4 h-48 w-2/3 p-2 flex flex-col flex-wrap">
            {tags.map((tag) => (
              <Tag
                key={tag}
                size=" md"
                borderRadius="full"
                variant="solid"
                colorScheme="teal"
                className="TagLabel  flex justify-center bg-gradient-to-br from-red-500 to-red-300 border-small border-white/50 shadow-red-500/10"
              >
                <TagLabel className="">{tag}</TagLabel>
                <TagCloseButton
                  className="TagCloseButton"
                  onClick={() => handleDelete(tag)}
                />
              </Tag>
            ))}
            <Input placeholder="tags" onKeyDown={handleKeyDown} className="" />
          </Card>
           <Card className=" h-56 w-3/4 mt-20">
              <Slideshow/>
            </Card>
        </Card>
        <div className="w-3/4 flex flex-wrap  border-gray-500 border-2 border-l-0 justify-center  max-h-full rounded-xl rounded-l-none ">
          {filteredPosts &&
            filteredPosts.map((post) => (
              <Card key={post.id} className="Post m-11">
                <CardHeader className="flex">
                  <div className="flex w-1/2 justify-start items-center">
                    <Avatar text={post.by.charAt(0).toUpperCase()} />
                    <h2 className="font-bold text-xl ml-4">{post.title}</h2>
                  </div>
                  <div className="flex w-1/2 justify-end">
                    <Chip
                      variant="shadow"
                      classNames={{
                        base: "bg-gradient-to-br from-red-500 to-red-400 border-small border-white/50 shadow-red-500/20 m-2 w-1/2 h-12",
                        content: "drop-shadow shadow-black  ",
                      }}
                    >
                      {/* className="m-2 w-1/2 h-12 items-center justify-center  border-gray-500 border-2 rounded-xl" */}
                      {post.tag}
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className=" overflow-y-auto">{post.content}</p>
                </CardBody>

                <p className="pb-4 pl-4 text-sm text-gray-500 flex justify-end pr-4">
                  Posted by {post.by}
                </p>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
