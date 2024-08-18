import React, { useState, useEffect } from 'react';

import * as styles from './styles';

import Button from '../Button';
import { IFileInputRHF } from '../../../config/interfaces/IForm';

export default function FileInput({
  id,
  options,
  rhfConfig,
  setValue,
  resetCalled,
}: IFileInputRHF) {
  const {
    rhfErrors,
    rhfRegister,
    rhfValidationFn = () => {
      return { valid: true, errorMsg: '' };
    },
  } = rhfConfig;

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: any) => {
    const files = e.target.files;
    if (files.length > 0) {
      for (const file of files) {
        setFiles((prev) => [...prev, file]);
      }
    }
  };

  const [validationValue, setValidationValue] = useState({
    valid: false,
    errorMsg: '',
  });

  const readJSON = async (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const fileContent = event.target.result;
        const obj = JSON.parse(fileContent);
        resolve(obj);
      };
      reader.readAsText(file);
    });
  };

  const convertMediaToBase64: (file: File) => Promise<string> = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageData = e.target?.result;
        if (imageData) {
          resolve(String(imageData));
        }
        reject();
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const processFiles = async () => {
      const obj: {
        json: any;
        photos: { filename: string; base64: string }[];
        videos: { filename: string; base64: string }[];
        audios: { filename: string; base64: string }[];
      } = {
        json: {},
        photos: [],
        videos: [],
        audios: [],
      };

      for (const file of files) {
        if (file.type === 'application/json') {
          const instaChat = await readJSON(file);
          obj.json = instaChat;
        }

        if (
          file.type === 'image/jpeg' ||
          file.type === 'image/jpg' ||
          file.type === 'image/png'
        ) {
          const base64Image = await convertMediaToBase64(file);
          obj.photos.push({ filename: file.name, base64: base64Image });
        }

        if (file.type === 'video/mp4') {
          const base64 = await convertMediaToBase64(file);
          if (file.name.startsWith('audio')) {
            obj.audios.push({ filename: file.name, base64 });
          } else {
            obj.videos.push({ filename: file.name, base64 });
          }
        }
      }

      setValue(id, obj);
    };

    processFiles();
  }, [files]);

  useEffect(() => {
    setFiles([]);
  }, [resetCalled]);

  const validation = (value: any) => {
    const validate = rhfValidationFn(value);
    setValidationValue(validate);
    return validate;
  };

  // rhfRegister is responsible to set the payload keys with the id and the input submittion options (ex: validate)
  const { ...registerProps } = rhfRegister(id, {
    valueAsNumber: options.type === 'number',
    validate: (value: any) => {
      const { valid } = validation(value);
      return valid;
    },
  });

  return (
    <styles.InputContainer>
      <input
        style={{
          opacity: 0,
          position: 'absolute',
          width: 0,
          color: options.disabled ? '#cecece' : 'white',
        }}
        id={id}
        {...options}
        {...registerProps}
        onChange={handleFileChange}
        aria-invalid={rhfErrors[id] ? 'true' : 'false'}
      />
      <label htmlFor={id}>
        <Button
          attributes={{
            id: id,
            type: 'button',
            onClick: () => {
              document.getElementById(id)?.click();
            },
          }}
          btnType="BLUE"
          label="Adicionar Arquivos"
        />
      </label>
      {rhfErrors[id] && rhfErrors[id]!.type === 'required' && (
        <styles.ErrorMessage>Campo obrigatório.</styles.ErrorMessage>
      )}
      {rhfErrors[id] && rhfErrors[id]!.type === 'validate' && (
        <styles.ErrorMessage>{validationValue.errorMsg}</styles.ErrorMessage>
      )}
      <styles.SelectedFilesContainer>
        <h2>Arquivos Selecionados</h2>
        {files.length > 0 && (
          <styles.FilesListContainer>
            {files.map((file, index) => (
              <h3 key={index}>{file.name}</h3>
            ))}
          </styles.FilesListContainer>
        )}
      </styles.SelectedFilesContainer>
    </styles.InputContainer>
  );
}
