import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useCreateRoom } from "../rooms.queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { FieldGroup } from "@/shared/ui/field";

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Название обязательно")
    .max(100, "Название слишком длинное"),
});

export function CreateRoomDialog({
  children,
}: {
  children: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const createRoom = useCreateRoom();

  const form = useForm({
    defaultValues: { name: "" },
    validators: { onSubmit: createRoomSchema },
    onSubmit: async ({ value }) => {
      await createRoom.mutateAsync({
        name: value.name.trim(),
        type: "ROOM_TYPE_GROUP",
      });
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) form.reset();
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать комнату</DialogTitle>
          <DialogDescription>
            Создайте новую комнату для общения с участниками
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => (
                <FormField
                  field={field}
                  label="Название"
                  placeholder="Название комнаты"
                  disabled={createRoom.isPending}
                />
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={createRoom.isPending}>
              {createRoom.isPending ? "Создание..." : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
