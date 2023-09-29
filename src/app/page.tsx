'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import axios from 'axios';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  challengeKey: z.string().nonempty({ message: 'Challenge key is required' }),
});

const Home = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      challengeKey: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast({
        description: 'Registering Commands...',
      });

      await axios.post('/api/register-commands', {
        CHALLENGE_KEY: values.challengeKey,
      });
      
      toast({
        title: 'Success!',
        description: 'Commands registered successfully!',
        variant: 'success',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return toast({
          title: 'Error',
          description: error.response?.data?.message,
          variant: 'destructive',
        });
      }

      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-[92.5vh] flex items-center w-full"
      >
        <div className="flex items-center justify-center w-full space-x-2">
          <FormField
            control={form.control}
            name="challengeKey"
            render={({ field }) => (
              <FormItem className="w-1/2 md:w-1/3">
                <FormLabel>Challenge Key</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input placeholder="mostsecurekey123!" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="self-end">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Home;
