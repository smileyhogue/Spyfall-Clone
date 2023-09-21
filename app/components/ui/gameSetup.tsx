"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { startGame, joinGame } from "../../actions/startGame";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const hostSchema = z.object({
  name: z.string().min(2).max(50),
});
const joinSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(50, {
      message: "Username must be less than 50 characters.",
    }),
  gameID: z
    .string()
    .min(6, {
      message: "Game ID must be 6 characters.",
    })
    .max(6, {
      message: "Game ID must be 6 characters.",
    }),
});

export default function GameSetup() {
  const [ToGame, setToGame] = useState("");
  const router = useRouter();
  async function host(data: object) {
    const gameData = await startGame(data);
    const sessionID = gameData.sessionID;
    setToGame(sessionID);
  }

  async function join(data: object) {
    console.log(data);
    const gameData = await joinGame(data);
    if (!gameData) {
        console.log("wrong session id");
          return;
      }
    const sessionID = gameData.sessionID;
    setToGame(sessionID);
  }

  useEffect(() => {
    if (ToGame) {
      router.push(`/game/${ToGame}`);
    }
  }, [ToGame, router]);

  const hostform = useForm<z.infer<typeof hostSchema>>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      name: "",
    },
  });
  const joinform = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      name: "",
      gameID: "",
    },
  });
  return (
    <div className="flex flex-col space-y-4 mb-12">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Host a game</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Form {...hostform}>
              <form
                onSubmit={hostform.handleSubmit(host)}
                className="space-y-8"
              >
                <FormField
                  control={hostform.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your display name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Join a game</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="items-center">
            <Form {...joinform}>
              <form
                onSubmit={joinform.handleSubmit(join)}
                className="space-y-8"
              >
                <FormField
                  control={joinform.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your display name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>

                <FormField
                  control={joinform.control}
                  name="gameID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Session ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Session ID"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The host should have this.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
