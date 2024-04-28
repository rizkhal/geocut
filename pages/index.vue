<script setup>
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Inbox, CloudDownload, FileJson2 } from "lucide-vue-next";

const result = ref();
const loading = ref(false);

const form = reactive({
  file: null,
  precision: 2,
  coordinates: 2,
});

function onFileChange(event) {
  form.file = event.target.files[0];
}

async function submit() {
  loading.value = true;
  try {
    const formData = new FormData();
    Object.keys(form).map((name) => {
      formData.append(name, form[name]);
    });

    const response = await $fetch("/api/upload", {
      method: "post",
      body: formData,
    });

    result.value = response;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

const download = () => {
  const fileUrl = `${window.location.origin}/data/generated/${result.value?.file?.name}`;
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = "generated.json";
  link.target = "_blank";

  link.click();
};
</script>

<template>
  <div
    class="h-screen flex flex-col justify-center items-center space-y-8 md:mx-0 mx-4"
  >
    <Card class="w-full md:mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle class="text-xl">Truncate Geojson File</CardTitle>
        <CardDescription>
          Upload your geojson file and set the attributes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-12 gap-4">
          <div class="md:col-span-6 md:border-r md:pr-4 col-span-12">
            <div class="grid gap-4">
              <div class="grid gap-2">
                <Label for="file">File</Label>
                <Input id="file" type="file" required @change="onFileChange" />
              </div>
              <div class="grid gap-2">
                <Label for="precision">Precision</Label>
                <Input
                  id="precision"
                  type="number"
                  v-model="form.precision"
                  min="1"
                  required
                />
              </div>
              <div class="grid gap-2">
                <Label for="coordinate">Coordinate</Label>
                <Input
                  id="coordinate"
                  type="number"
                  v-model="form.coordinates"
                  required
                />
              </div>
              <Button
                :disabled="loading"
                type="button"
                @click="submit"
                class="w-full"
              >
                Truncate
              </Button>
            </div>
          </div>
          <div
            class="md:col-span-6 col-span-12 justify-center items-center w-full flex flex-col"
          >
            <div
              class="w-24 h-24 rounded-xl flex justify-center items-center"
              :class="{ 'bg-primary': result }"
            >
              <FileJson2 v-show="result" class="size-1/2 text-secondary" />
              <div
                v-show="!result"
                class="flex flex-col items-center text-muted"
              >
                <Inbox class="size-10" />
                <span class="text-sm">Empty</span>
              </div>
            </div>
            <div class="mt-2" v-show="result">
              <Button variant="link" @click="download">
                <span>Download</span>
                <CloudDownload class="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
