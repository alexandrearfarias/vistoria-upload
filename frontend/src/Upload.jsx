import { useRef, useState } from "react";
import { useForm } from 'react-hook-form';

function Upload({ user }) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [arquivos, setArquivos] = useState([]);
    const fileInputRef = useRef();

    const handleFiles = (files) => {
        const lista = Array.from(files);
        setArquivos((prev) => [...prev, ...lista]);
    };

    const removerArquivo = (index) => {
        const novaLista = [...arquivos];
        novaLista.splice(index, 1);
        setArquivos(novaLista);
    };

    const onSubmit = async (data) => {

        if (arquivos.length === 0) {
            alert("Selecione arquivos");
            return;
        }

        const formData = new FormData();

        formData.append("cidade", cidade);
        formData.append("local", local);
        formData.append("equipamento", equipamento);
        formData.append("item", item);

        arquivos.forEach(file => {
            formData.append("arquivos", file);
        });

        try {
            await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData
            });

            alert("Enviado!");
        } catch (error) {
            alert("Erro ao enviar: " + error);
        }
    };

    return (
        <div style={backgroundStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-6 col-lg-4">
                        <div className="card shadow">

                            <div className="card-header text-center">
                                <i className="bi bi-cloud-upload me-2"></i>
                                <h5 className="mb-0">Upload de Vistoria</h5>
                            </div>

                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Cidade */}
                                    <div className="mb-3">
                                        <input className="form-control" placeholder="Cidade" {...register("cidade", { required: "Cidade é obrigatório" })} />
                                        {errors.cidade && <small className="text-danger">{errors.cidade.message}</small>}
                                    </div>
                                    {/* Local */}
                                    <div className="mb-3">
                                        <input className="form-control" placeholder="Local" {...register("local", { required: "Cidade é obrigatório" })} />
                                        {errors.local && <small className="text-danger">{errors.local.message}</small>}
                                    </div>
                                    {/* Equipamento */}
                                    <div className="mb-3">
                                        <input className="form-control" placeholder="Equipamento" {...register("equipamento", { required: "Cidade é obrigatório" })} />
                                        {errors.equipamento && <small className="text-danger">{errors.equipamento.message}</small>}
                                    </div>
                                    {/* Item */}
                                    <div className="mb-3">
                                        <input className="form-control" placeholder="Item" {...register("item", { required: "Cidade é obrigatório" })} />
                                        {errors.item && <small className="text-danger">{errors.item.message}</small>}
                                    </div>

                                    {/* Área Upload */}
                                    <div className="border border-secondary rounded p-3 text-center mb-3" style={{ cursor: "pointer", borderStyle: "dashed" }}
                                        onClick={() => fileInputRef.current.click()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            handleFiles(e.dataTransfer.files);
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        <i className="bi bi-file-earmark-arrow-up fs-3"></i>
                                        <div>Arraste ou clique aqui.</div>

                                        <input type="file" multiple ref={fileInputRef} style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
                                    </div>

                                    {/* Listagem dos arquivos adicionados */}
                                    <ul className="list-group mb-3">
                                        {arquivos.map((file, i) => {
                                            <li key={i} className="list-group-item d-flex justify-content-center align-items-center">
                                                {file.name}
                                                <button className="btn btn-sm btn-danger" type="button" onClick={() => removerArquivo(i)}><i className="bi bi-x-lg"></i></button>
                                            </li>
                                        })}
                                    </ul>

                                    <button className="btn btn-primary w-100" type="submit">Enviar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const backgroundStyle = {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #ffffff 0%, #88b1fd 60%, #2e77ff 100%)",
    display: "flex",
    alignItems: "center"
};

export default Upload;