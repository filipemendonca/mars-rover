<script setup lang="ts">
import { InputText, Button, InputNumber, Panel, ScrollPanel, Card, Message } from 'primevue'
import MarsRover from './icons/MarsRover.vue'
import Planet from './icons/Planet.vue'
</script>

<template>
  <div class="mars-icon">
    <Planet id="marsPlanet" height="150" width="150" />
    <div>
      <h1>Mars Rover</h1>
    </div>
  </div>
  <Message
    v-for="(msg, index) in messages"
    :key="index"
    severity="error"
    class="mt-4"
    closable
    style="margin-bottom: 5px"
    >{{ msg }}</Message
  >
  <div class="card" style="margin-bottom: 10px">
    <Panel header="Plateau Configuration">
      <div>
        <InputNumber
          v-model="plateau.x"
          inputId="x"
          placeholder="Plateau Size X"
          style="margin-right: 5px"
        />
        <InputNumber v-model="plateau.y" inputId="y" placeholder="Plateau Size Y" />
      </div>
    </Panel>
  </div>
  <div class="card" style="margin-bottom: 10px">
    <Panel header="Rovers configurations">
      <div
        v-for="(input, index) in rovers"
        :key="`rover-${index}`"
        class="card flex flex-wrap gap-4"
      >
        <div class="flex-auto m-2" style="margin-bottom: 5px">
          <InputText
            v-model="input.landingPosition"
            :inputId="`rover-${index}-landingPosition`"
            placeholder="Landing Position"
            style="margin-right: 5px"
            maxlength="3"
            v-on:keypress="configureInput($event, /^[nsewNSEW0-9]+$/)"
          />
          <InputText
            v-model="input.instruction"
            :inputId="`rover-${index}-instruction`"
            placeholder="Instruction"
            v-on:keypress="configureInput($event, /^[mrlMRL]+$/)"
          />
          <Button icon="pi pi-plus" @click="addField(rovers)" style="margin-left: 5px" />
          <Button
            icon="pi pi-times"
            severity="danger"
            aria-label="Cancel"
            style="margin-left: 5px"
            v-show="rovers.length > 1"
            @click="removeField(index, rovers)"
          />
          Rover - {{ index }}
        </div>
      </div>
    </Panel>
  </div>
  <Button
    style="margin-bottom: 10px"
    class="flex-auto"
    icon="pi pi-check"
    label="Execute"
    @click="execute()"
  />
  <div v-if="showResult">
    <ScrollPanel style="width: 90%">
      <div class="contentPanel">
        <Card
          v-for="(item, index) in result"
          :key="`resultRover-${index}`"
          style="width: 15rem; justify-content: center; align-items: center; margin: 10px"
        >
          <template #title>Rover - {{ index }}</template>
          <template #subtitle> <MarsRover height="100" width="100" /></template>
          <template #content>
            <div><strong style="margin-right: 3px">Position X:</strong>{{ item.x }}</div>
            <div><strong style="margin-right: 3px">Position Y:</strong>{{ item.y }}</div>
            <div><strong style="margin-right: 3px">Orientation:</strong>{{ item.orientation }}</div>
          </template>
        </Card>
      </div>
    </ScrollPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WalkService from '@/services/WalkService'
import type ResponseData from '@/types/ResponseApi'
import type Plateau from '@/types/Plateau'
import type NasaType from '@/types/NasaModel'
import type Configurations from '@/types/Configuration'
import type RoverDTO from '@/types/Rover'

export default defineComponent({
  name: 'execute-rovers',
  data() {
    return {
      plateau: {
        x: null,
        y: null,
      } as Plateau,
      rovers: [{ instruction: '', landingPosition: '' }] as Configurations[],
      showResult: false,
      result: [] as ResponseData[],
      messages: [] as string[],
    }
  },
  methods: {
    configureInput(e, pattern: RegExp) {
      const char = String.fromCharCode(e.keyCode)
      if (pattern.test(char)) return true
      else e.preventDefault()
    },
    addField(fieldType: Configurations[]) {
      fieldType.push({ landingPosition: '', instruction: '' })
    },
    removeField(index: number, fieldType: Configurations[]) {
      fieldType.splice(index, 1)
    },
    async execute() {
      const dataPlateau: NasaType = {
        x: this.plateau.x,
        y: this.plateau.y,
      }
      const roversDTO: RoverDTO = {
        rovers: JSON.parse(JSON.stringify(this.rovers)) as Configurations[],
      }

      await WalkService.Execute(dataPlateau, roversDTO)
        .then((response) => {
          this.result = response?.data
          this.showResult = true
        })
        .catch((e: Error) => {
          const { message, response } = e

          if (!response) {
            this.messages.push(message)
          } else {
            const { message } = response.data
            if (message) {
              message.forEach((item: string) => {
                this.messages.push(item)
              })
            }
          }
        })
    },
  },
})
</script>
