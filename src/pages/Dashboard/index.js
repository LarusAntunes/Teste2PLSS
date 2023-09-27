import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'

import Header from '../../components/Header';
import Title from "../../components/Title"
import Modal from '../../components/Modal';
import './dashboard.css'

import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi'
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnections';

import { format } from 'date-fns'

const listRef = collection(db, "chamados")
//chamados vem lá do banco de dados, nome ja gravado lá

export default function Dashboard() {

    const [chamados, setChamados] = useState([])
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLastDocs] = useState()
    const [loadingMore, setLoadingMore] = useState(false)
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState()


    const { logout } = useContext(AuthContext);

    useEffect(() => {
        async function loadChamados() {
            const q = query(listRef, orderBy('created', 'desc'), limit(5));

            const querySnapshot = await getDocs(q)
            setChamados([]);

            await updateState(querySnapshot)

            setLoading(false);

        }
        loadChamados();

        return () => { }
    }, [])

    async function updateState(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDocs = querySnapshot.docs[querySnapshot.docs.length - 1]
            //pegando o ultimo item renderizado

            setChamados(chamados => [...chamados, ...lista])
            setLastDocs(lastDocs);

        } else {
            setIsEmpty(true);
        }
        setLoadingMore(false)
    }

    async function handleMore() {
        setLoadingMore(true);

        const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5));
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);
    }


    function toggleModal(item) {
        setShowPostModal(!showPostModal)
        setDetail(item)
    }

    if (loading) {
        return (
            <div>
                <Header />

                <div className="content">
                    <Title name="Chamados">
                        <FiMessageSquare size={25} />
                    </Title>
                    <div className="container dashboard">
                        <span>Buscando chamados</span>
                    </div>
                </div>
            </div>
        )
    }



    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Chamados">
                    <FiMessageSquare size={25} />
                </Title>

                <>

                    {chamados.length === 0 ? (
                        <div className="container dashboard">
                            <span>Nenhum chamado encontrado...</span>
                            <Link className="new" to="/new">
                                <FiPlus color="#FFF" size={25} />
                                Novo Chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link className="new" to="/new">
                                <FiPlus color="#FFF" size={25} />
                                Novo Chamado
                            </Link>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label="Cliente">{item.cliente}</td>
                                                <td data-label="Assunto">{item.assunto}</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                                                        {item.status}
                                                    </span>

                                                </td>
                                                <td data-label="Cadastrado">{item.createdFormat}</td>
                                                <td data-label="#">
                                                    <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => toggleModal(item)}>
                                                        <FiSearch color="#FFF" size={17} />
                                                    </button>
                                                    <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                                                        <FiEdit2 color="#FFF" size={17} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {loadingMore && <h3>Buscando mais chamados...</h3>}
                            {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
                        </>

                    )}


                </>
            </div>

            {showPostModal && (
                <Modal
                    conteudo={ detail}
                    close={()=>setShowPostModal(!showPostModal)}
                />

            )}

        </div>
    )
}