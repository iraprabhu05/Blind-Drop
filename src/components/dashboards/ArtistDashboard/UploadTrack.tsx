
import React, { useState } from 'react';
import { UploadCloud, Music, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

const UploadTrack = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    
    const onAudioDrop = (acceptedFiles) => setAudioFile(acceptedFiles[0]);
    const onCoverDrop = (acceptedFiles) => setCoverFile(acceptedFiles[0]);

    const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps, isDragActive: isAudioDragActive } = useDropzone({ onDrop: onAudioDrop, accept: { 'audio/*': [] } });
    const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({ onDrop: onCoverDrop, accept: { 'image/*': [] } });

    const handleUpload = () => {
        if (!audioFile) {
            toast.error("Please select an audio file.");
            return;
        }
        setUploading(true);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setUploading(false);
                    toast.success("Track uploaded successfully!", { icon: <CheckCircle className="text-green-500"/> });
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      <header>
        <h1 className="text-4xl font-bold text-white">Upload New Track</h1>
        <p className="text-gray-400 mt-2">Add your latest creation to Blind Drop.</p>
      </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left column for uploads */}
        <div className="space-y-6">
            {/* Audio Upload */}
            <div {...getAudioRootProps()} className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isAudioDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 hover:border-violet-600'}`}>
                <input {...getAudioInputProps()} />
                <UploadCloud className="mx-auto text-violet-400 mb-2" size={40} />
                <p className="font-semibold">{audioFile ? audioFile.name : 'Drag & drop audio file or click'}</p>
                <p className="text-sm text-gray-500">MP3, WAV, FLAC</p>
            </div>

            {/* Cover Art Upload */}
            <div {...getCoverRootProps()} className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isCoverDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 hover:border-violet-600'}`}>
                <input {...getCoverInputProps()} />
                <ImageIcon className="mx-auto text-pink-400 mb-2" size={40} />
                <p className="font-semibold">{coverFile ? coverFile.name : 'Drag & drop cover art or click'}</p>
                <p className="text-sm text-gray-500">JPG, PNG</p>
            </div>
        </div>

        {/* Right column for form fields */}
        <div className="bg-[#1C1C1C] p-8 rounded-2xl border border-gray-800">
            <div className="space-y-6">
                <Input placeholder="Track Title" className="bg-gray-800 border-gray-700 h-12" />
                <Input placeholder="Genre (e.g., Cyber-Funk)" className="bg-gray-800 border-gray-700 h-12" />
                <Input placeholder="Mood Tags (e.g., Energetic, Dark)" className="bg-gray-800 border-gray-700 h-12" />
                <Textarea placeholder="Description" className="bg-gray-800 border-gray-700" rows={4} />
            </div>
        </div>
    </div>
      

      {/* Upload Progress and Submit */}
      <div className="space-y-4">
        {uploading && <Progress value={progress} className="w-full h-3 [&>*]:bg-violet-500" />}
        <Button onClick={handleUpload} disabled={uploading} size="lg" className="w-full font-bold text-lg bg-violet-600 hover:bg-violet-700">
            {uploading ? `Uploading... ${progress}%` : 'Upload Track'}
        </Button>
      </div>
    </div>
  );
};

export default UploadTrack;
