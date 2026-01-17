import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { UserInput } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface InputFormProps {
  input: UserInput;
  setInput: (value: any) => void;
  onSubmit: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
  input,
  setInput,
  onSubmit,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const b64 = await fileToBase64(e.target.files[0]);
      setInput((prev: any) => ({ ...prev, image: b64 }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <label className="text-sm font-bold">1. Site Photo</label>

        <div
          onClick={() => fileRef.current?.click()}
          className="h-64 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden bg-white"
        >
          {input.image ? (
            <img
              src={input.image}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Upload size={32} />
          )}

          <input
            type="file"
            ref={fileRef}
            onChange={handleFile}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>

      <div className="space-y-6">
        <label className="text-sm font-bold">2. Renovation Scope</label>

        <textarea
          value={input.prompt}
          onChange={(e) =>
            setInput((prev: any) => ({
              ...prev,
              prompt: e.target.value,
            }))
          }
          className="w-full h-32 p-4 border rounded-xl"
          placeholder="Describe the garden..."
        />

        <button
          onClick={onSubmit}
          disabled={!input.image || !input.prompt}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg disabled:bg-slate-200"
        >
          Generate Transformation
        </button>
      </div>
    </div>
  );
};

export default InputForm;
