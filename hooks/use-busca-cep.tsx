"use client";
import { TransitionStartFunction, useEffect } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import CepSearc from "../lib/actions/searchCep.actions";

export function useBuscarCep<T extends FieldValues>(
  form: UseFormReturn<T>,
  startTransition: TransitionStartFunction
) {
  const cep = form.watch("cep" as Path<T>);

  useEffect(() => {
    if (!cep || cep.length !== 9) return;

    startTransition(() => {
      CepSearc({ cep })
        .then((response) => {
          if (response.bairro) {
            form.setValue("endereco" as Path<T>, response.logradouro);
            form.setValue("estado" as Path<T>, response.bairro);
            form.setValue("municipio" as Path<T>, response.localidade);
            form.setValue("estado" as Path<T>, response.estado);
            form.clearErrors("cep" as Path<T>);
            console.log(response)
          } else {
            limparCamposCEP(form, "Cep não encontrado");
          }
        })
        .catch(() => {
          limparCamposCEP(form, "Erro ao buscar CEP");
        });
    });
  }, [cep, form]);

  return null;
}

// Função auxiliar para limpar os campos e exibir erro
function limparCamposCEP<T extends FieldValues>(
  form: UseFormReturn<T>,
  mensagem: string
) {
  form.setError("cep" as Path<T>, {
    type: "value",
    message: mensagem,
  });
  form.setValue("estado" as Path<T>, "" as PathValue<T, Path<T>>);
  form.setValue("municipio" as Path<T>, "" as PathValue<T, Path<T>>);
  form.setValue("endereco.bairro" as Path<T>, "" as PathValue<T, Path<T>>);
  form.setValue("endereco.municipio" as Path<T>, "" as PathValue<T, Path<T>>);
  form.setValue("endereco.uf" as Path<T>, "" as PathValue<T, Path<T>>);
}
