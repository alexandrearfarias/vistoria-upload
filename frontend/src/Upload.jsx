import { useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { googleLogout } from "@react-oauth/google";

function Upload({ user, onLogout }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [arquivos, setArquivos] = useState([]);
    const fileInputRef = useRef();

    const handleFiles = (files) => {
        const lista = Array.from(files);
        setArquivos((prev) => [...prev, ...lista]);
    };

    const handleLogout = () => {
        if (user?.acess_token && window.google?.accounts?.oauth2) {
            window.google.accounts.oauth2.revoke(user.access_token, () => {
                googleLogout();
                onLogout();
            });

            return;
        }

        googleLogout();
        onLogout();
    }

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

        formData.append("cidade", data.cidade);
        formData.append("local", data.local);
        formData.append("equipamento", data.equipamento);
        formData.append("item", data.item);

        arquivos.forEach(file => {
            formData.append("arquivos", file);
        });

        try {
            const response = await fetch("http://localhost:3000/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erro ao enviar.");
            }

            alert(result.message || "Arquivos adicionados no drive.");
            setArquivos([]);
        } catch (error) {
            alert("Erro ao enviar: " + error.message);
        }
    };

    return (
        <div style={backgroundStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-6 col-lg-4">
                        <div className="card shadow">

                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <h5 className="mb-0 me-2">Upload de Vistoria</h5>
                                    <i className="bi bi-cloud-upload me-2"></i>
                                </div>

                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Sair</button>
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
                                        <input className="form-control" placeholder="Local" {...register("local", { required: "Local é obrigatório" })} />
                                        {errors.local && <small className="text-danger">{errors.local.message}</small>}
                                    </div>
                                    {/* Equipamento */}
                                    <div className="mb-3">
                                        <input className="form-control" placeholder="Equipamento" {...register("equipamento", { required: "Equipamento é obrigatório" })} />
                                        {errors.equipamento && <small className="text-danger">{errors.equipamento.message}</small>}
                                    </div>
                                    {/* Item */}
                                    <div className="mb-3">
                                        <input className="form-control" placeholder="Item" {...register("item", { required: "Item é obrigatório" })} />
                                        {errors.item && <small className="text-danger">{errors.item.message}</small>}
                                    </div>

                                    {/* Área Upload */}
                                    <div className="border border-secondary rounded p-3 text-center mb-3" style={{ cursor: "pointer", borderStyle: "dashed" }}
                                        onClick={() => fileInputRef.current?.click()}
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
                                        {arquivos.map((file, i) => (
                                            <li key={i} className="list-group-item d-flex justify-content-center align-items-center">
                                                {file.name}
                                                <button className="btn btn-sm btn-danger ms-3" type="button" onClick={() => removerArquivo(i)}><i className="bi bi-x-lg"></i></button>
                                            </li>
                                        ))}
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