import { FormEvent, useEffect, useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog"
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { Check, Database, GameController } from 'phosphor-react';

import { Input } from './form/Input';

import axios from 'axios';

interface Game {
  id: string;
  title: string;
}

export function CreateAppModal() {

  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false);

  useEffect(() => {
    axios('http://localhost:3333/games')
    .then(response => {
      setGames(response.data)
    })
  }, [])

  // Inserção
  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    try {
      await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hoursEnd: data.hourEnd,
        useVoiceChannel: useVoiceChannel
      })
      alert('Anúncio criado com sucesso!');
      location.reload();
    }
    catch ( err ) {
      console.log( err );
      alert('Erro ao criar o anpuncio!');
    }
  }

    return (
        <Dialog.Portal>
        <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>

          <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] max-h-[85vh] overflow-y-scroll h-auto shadow-lg shadow-black/25 max-sm:max-w-xs'>

            <Dialog.Title className='text-3xl font-black'>Publique um anúncio</Dialog.Title>

            <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>

              <div className='flex flex-col gap-2'>
                <label htmlFor="game" className='font-semibold'>Qual o game?</label>
                <select 
                id="game"
                className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder: text-zinc-500 appearance-none'
                defaultValue=""
                name="game"
                required
                >
                  <option disabled value="">Selecione o game que deseja jogar</option>

                  {games.map(game => {
                    return <option value={game.id} key={game.id}>{game.title}</option>
                  })}

                </select>
                
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor="name">Seu nome (ou nickname)</label>
                <Input 
                id="name" 
                type="text" 
                placeholder='Como te chamam dentro do game?' 
                name="name"
                required/>
              </div>

              <div className='grid grid-cols-2 gap-6 max-sm:flex flex-col'>
                
                <div className='flex flex-col gap-2'>
                  <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
                  <Input 
                  id="yearsPlaying" 
                  type="number" 
                  name="yearsPlaying"
                  placeholder='Tudo bem ser ZERO!'
                  min={0}
                  required/>
                </div>

                <div className='flex flex-col gap-2'>
                  <label htmlFor="discord">Qual seu Discord?</label>
                  <Input 
                  id="discord" 
                  type="text" 
                  placeholder='Usuario#0000' 
                  name="discord"
                  required/>
                </div>

              </div>

              <div className='flex gap-6 max-sm:flex-col'>

                <div className='flex flex-col gap-2'>
                  <label htmlFor="weekDays">Quando costuma jogar?</label>

                  <ToggleGroup.Root 
                    type={'multiple'} className='grid grid-cols-4 gap-2'
                    value={weekDays}
                    onValueChange={setWeekDays}
                  >

                    <ToggleGroup.Item
                      value="0"
                      title='Domingo'
                      className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    >D</ToggleGroup.Item>

                    <ToggleGroup.Item
                      value="1"
                      title='Segunda'
                      className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    >S</ToggleGroup.Item>

                    <ToggleGroup.Item
                      value="2"
                      title='Terça'
                      className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    >T</ToggleGroup.Item>

                    <ToggleGroup.Item
                      value="3"
                      title='Quarta'
                      className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    >Q</ToggleGroup.Item>

                    <ToggleGroup.Item
                      value="4"
                      title='Quinta'
                      className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    >Q</ToggleGroup.Item>

                    <ToggleGroup.Item
                      value="5"
                      title='Sexta'
                      className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    >S</ToggleGroup.Item>

                    <ToggleGroup.Item
                      value="6"
                      title='Sábado'
                      className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    >S</ToggleGroup.Item>

                  </ToggleGroup.Root>
                </div>

                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor="hourStart">Qual horário do dia?</label>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input 
                    id="hourStart" 
                    type="time" 
                    placeholder='De' 
                    name="hourStart"
                    required/>

                    <Input 
                    id="hourEnd" 
                    type="time" 
                    placeholder='Até' 
                    name="hourEnd"
                    required/>
                  </div>
                </div>

              </div>

              <label className='mt-2 flex gap-2 text-sm items-center'>
                <Checkbox.Root 
                checked={useVoiceChannel}
                className="w-6 h-6 p-1 rounded bg-zinc-900"
                onCheckedChange={(checked) => {
                  if (checked === true) {
                    setUseVoiceChannel(true);
                  } else {
                    setUseVoiceChannel(false);
                  }
                }}>
                  <Checkbox.CheckboxIndicator>
                    <Check className="w4 h-4 text-emerald-400"/>
                  </Checkbox.CheckboxIndicator>
                </Checkbox.Root>
                Costumo me conectar ao chat de voz
              </label>

              <footer className='mt-4 flex justify-end gap-4 max-sm:flex-col'>

                <Dialog.Close
                type='button'
                className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'
                >Cancelar
                </Dialog.Close>

                <button 
                type='submit' 
                className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center justify-center gap-3 hover:bg-violet-600'>
                  <GameController size={24} />
                  Encontrar duo
                </button>

              </footer>

            </form>

          </Dialog.Content>

      </Dialog.Portal>
    )
}