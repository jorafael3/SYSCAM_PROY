import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CFormSelect,
    CSpinner,
    CInputGroup,
    CInputGroupText,
    CWidgetStatsC,

} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
    cilPlus,
} from '@coreui/icons'

import React, { useEffect, useState } from 'react'
import Service from "../../services/Service"
import FullScreenSpinner from '../../components/FullScreenSpinner ';
// import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import $, { data } from 'jquery';

import 'datatables.net'; // DataTables core
import 'datatables.net-buttons'; // Botones

import jszip from 'jszip'; // Para exportar a Excel
import 'datatables.net-buttons/js/buttons.html5.min'; // Botón para exportar a Excel


// import 'datatables.net-dt/css/jquery.dataTables.css';
// import 'datatables.net-buttons/js/buttons.colVis';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons-dt/css/buttons.dataTables.css';

var URL_CARGAR_CAMARA = "/incidencias/cargar_camaras";
var URL_CARGAR_INCIDENCIAS = "/incidencias/cargar_camaras_incidencias";
var URL_AGREGAR_INCIDENCIA = "/incidencias/agregar_incidencia";

function Incidencias() {
    const [visible_secc, setvisible_secc] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibledet, setVisibledet] = useState(false);

    const [SUCURSAL_ID, setSUCURSAL_ID] = useState("");
    const [CAMARA_ID, setCAMARA_ID] = useState("");

    const [INC_DET, setINC_DET] = useState("");
    const [INC_DET_NOM, setINC_DET_NOM] = useState("");
    const [INC_DET_FECHA, setINC_DET_FECHA] = useState("");

    const [INF_COD, setINF_COD] = useState("");
    const [INF_NOM, setINF_NOM] = useState("");
    const [INF_DESC, setINF_DESC] = useState("");
    const [INF_UBI, setINF_UBI] = useState("");
    const [INF_ENC, setINF_ENC] = useState("");
    const [INF_TELT, setINF_TELT] = useState("");



    const Cargar_Datos_camara = async () => {
        let CODIGO = $("#CODIGO").val();

        let param = {
            CODIGO: CODIGO
        }

        if (CODIGO.trim() == "") {
            Service.Mensaje("Ingrese codigo de la camara", "", "info");
            return;
        }

        

        const datos = await Service.AjaxSendReceive(URL_CARGAR_CAMARA, param);
        
        if (datos.data.success) {
            let info = datos.data.data
            console.log('info: ', info);
            if (info.length > 0) {
                setvisible_secc(true);
                Llenar_Datos(info[0]);
                setSUCURSAL_ID(info[0]["SUCURSAL_ID"]);
                setCAMARA_ID(info[0]["CAMARA_ID"]);
                Cargar_Datos_incidencias(info[0]["SUCURSAL_ID"], info[0]["CAMARA_ID"]);

                // Tabla_incidencias([])
            } else {
                Service.Mensaje("No se encuentran datos para este código", "", "info");
            }
            

        } else {
            Service.Mensaje("Error al cargar consulta", "Intentelo en un momento", "error")
        }

    }

    const Cargar_Datos_incidencias = async (SUC, CAM) => {
        let param = {
            SUCURSAL_ID: SUC,
            CAMARA_ID: CAM,
        }
        

        const datos = await Service.AjaxSendReceive(URL_CARGAR_INCIDENCIAS, param);
        
        if (datos.data.success) {
            let info = datos.data.data
            Tabla_incidencias(info)
            $("#CANT_INCIDENCIAS").text(info.length)
            

        }
    }

    function Llenar_Datos(datos) {

        setINF_COD(datos.CAMARA_CODIGO);
        setINF_NOM(datos.CAMARA_NOMBRE);
        setINF_DESC(datos.CAMARA_DESCRIPCION);
        setINF_UBI(datos.CAMARA_UBICACION);
        setINF_ENC(datos.SUCURSAL_ENCARGADO);
        setINF_TELT(datos.SUCURSAL_TELEFONO);


    }

    function Tabla_incidencias(data) {
        $('#SECC_TABLA_INCIDENCIAS').empty();
        let a = `
        <table id='TABLA_INCIDENCIAS' class='table table-striped'>
        </table>
        `
        $('#SECC_TABLA_INCIDENCIAS').append(a);

        let TABLA_ = $('#TABLA_INCIDENCIAS').DataTable({
            destroy: true,
            data: data,
            dom: 'Bfrtip',
            paging: false,
            info: false,
            buttons: [
                {
                    text: `<span class"fw-bold">AGREGAR +</span>`,
                    className: 'btn btn-danger  fw-bold btn-sm',
                    action: function (e, dt, node, config) {
                        setVisible(true);
                    }
                },
                {
                    extend: 'excelHtml5',
                    text: 'Exportar a Excel',
                    className: 'btn btn-success',
                    exportOptions: {
                        columns: ':visible',
                    },
                },
            ],
            stateSave: true,
            // scrollCollapse: true,
            // scrollX: true,
            // columnDefs: [
            //     { width: 100, targets: 0 },
            //     { width: 300, targets: 2 },
            // ],
            order: [[0, "asc"]],
            columns: [
                {
                    "data": "FECHA_CREADO",
                    "title": "FECHA",
                    className: "text-start",
                    render: function (x) {
                        // moment.locale('es'); // Configura Moment.js para usar el español
                        x = moment(x).format("YYYY-MM-DD");
                        return x;
                    }
                }, {
                    "data": "NOMBRE_INCIDENCIA",
                    "title": "INCIDENCIA",
                    className: "text-start",
                }, {
                    "data": "DETALLE",
                    "title": "DETALLE",
                    className: "text-start",
                }, {
                    data: null,
                    title: "",
                    className: "btn_Detalles text-left", // Centrar la columna "Detalles" y aplicar la clase "btn_detalles"
                    defaultContent: '<button type="button" class="btn_Eliminar btn btn-info text-light btn-sm"><i class="bi bi-ui-checks"></i></button>',
                    orderable: "",
                    width: 20
                }

            ],
            "createdRow": function (row, data, index) {
                $('td', row).eq(0).addClass("fw-bold fs-6 ");
                $('td', row).eq(1).addClass("fw-bold fs-6 ");
                $('td', row).eq(2).addClass("fw-bold fs-6 ");
                $('td', row).eq(3).addClass("fw-bold fs-6 ");
                $('td', row).eq(0).addClass("bg-warning bg-opacity-10");

            },

        });

        $('#TABLA_INCIDENCIAS').on('click', 'td.btn_Detalles', function (respuesta) {
            var data = TABLA_.row($(this).closest('tr')).data();
            
            setVisibledet(true);
            setINC_DET_NOM(data.NOMBRE_INCIDENCIA);
            setINC_DET(data.DETALLE);
            setINC_DET_FECHA(moment(data.FECHA_CREADO).format("YYYY-MM-DD HH:mm"));
        });
    }

    const Agregar_Incidencia = async () => {
        let INCIDENCIA = $("#IND_INCIDENCIA").val();
        let DETALLE = $("#IND_DETALLE").val();

        let param = {
            SUCURSAL_ID: SUCURSAL_ID,
            CAMARA_ID: CAMARA_ID,
            INCIDENCIA: INCIDENCIA,
            DETALLE: DETALLE,

        }
        
        const datos = await Service.AjaxSendReceive(URL_AGREGAR_INCIDENCIA, param);
        
        if (datos.data.success) {
            Cargar_Datos_incidencias(SUCURSAL_ID, CAMARA_ID);
            setVisible(false);
            Service.Mensaje("Datos Guardados", "", "success")
        }
    }

    return (
        <>
            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Registro de incidencias
                            </h4>
                        </CCol>
                    </CRow>
                    <hr />
                    <CRow>
                        <CCol sm={4} className='pt-2'>
                            <h5>Ingrese código de la camara</h5>
                            <CInputGroup className="mb-3">
                                <CFormInput id='CODIGO' placeholder="0001-0001" aria-label="00001-00001" aria-describedby="basic-addon2" />
                                <CButton onClick={() => {
                                    // setvisibleCam(true);
                                    // setEsActualizarCam(0);
                                    Cargar_Datos_camara();
                                }} color="success" className='fw-bold text-light btn-sm'>
                                    <i className="bi bi-search fs-5"></i>
                                </CButton>
                            </CInputGroup>
                        </CCol>
                    </CRow>

                </CCardBody>
            </CCard >

            {visible_secc == true ? (
                <>
                    <CRow>
                        <CCol xs={12} lg={6} xxl={4}>
                            <div className="card card-flush h-md-50 mb-xl-10">
                                <div className="card-body d-flex flex-column justify-content-end pe-0">
                                    <h3 className='text-dark'>COMPUTRON KENNEDY</h3>
                                    <span className='text-muted fw-bold'>Sucursal</span>
                                </div>
                            </div>
                        </CCol>
                        <CCol xs={12} lg={6} xxl={4}>
                            <div className="card card-flush h-md-50 mb-xl-10">
                                <div className="card-body d-flex flex-column justify-content-end pe-0">
                                    <h3 id='CANT_INCIDENCIAS' className='text-dark'></h3>
                                    <span className='text-muted fw-bold'>Incidencias</span>
                                </div>
                            </div>
                        </CCol>
                    </CRow>
                    <CRow className='pt-3'>
                        <CCol xs={12} lg={6} xxl={6}>
                            <CCard className="mb-4">
                                <CCardBody>
                                    <h3 className='mb-3 text-muted'>Informacion</h3>
                                    <div className="progress-group">
                                        <div className="progress-group-header" style={{ marginBottom: -10 }}>
                                            <span className='fw-bold'>CODIGO</span>
                                            <span className="ms-auto fw-semibold" id='COD'>
                                                {INF_COD}
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="progress-group">
                                        <div className="progress-group-header" style={{ marginBottom: -10 }}>
                                            <span className='fw-bold'>NOMBRE</span>
                                            <span className="ms-auto fw-semibold" id='CAM_NOMBRE'>
                                                {INF_NOM}
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="progress-group">
                                        <div className="progress-group-header" style={{ marginBottom: -10 }}>
                                            <span className='fw-bold'>DESCRIPCION</span>
                                            <span className="ms-auto fw-semibold" id='CAM_DESCR'>
                                                {INF_DESC}
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="progress-group">
                                        <div className="progress-group-header" style={{ marginBottom: -10 }}>
                                            <span className='fw-bold'>UBICACION</span>
                                            <span className="ms-auto fw-semibold" id='CAM_UBI'>
                                                {INF_UBI}
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='bg-warning bg-opacity-50 p-1 mb-3'></div>
                                    <div className="progress-group">
                                        <div className="progress-group-header" style={{ marginBottom: -10 }}>
                                            <span className='fw-bold'>ENCARGADO</span>
                                            <span className="ms-auto fw-semibold" id='SUC_ENCARGADO'>
                                                {INF_ENC}
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="progress-group">
                                        <div className="progress-group-header" style={{ marginBottom: -10 }}>
                                            <span className='fw-bold'>TELEFONO</span>
                                            <span className="ms-auto fw-semibold" id='SUC_TELEFONO'>
                                                {INF_TELT}
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                </CCardBody>
                            </CCard >
                        </CCol>
                        <CCol xs={12} lg={6} xxl={6}>
                            <CCard className="mb-4">
                                <CCardBody>
                                    <h3 className='mb-3 text-muted'>Acciones</h3>
                                    <button className='btn btn-sm btn-danger m-1 text-light '><i className="bi bi-envelope-arrow-up-fill fs-4"></i></button>
                                    <button className='btn btn-sm btn-primary m-1 text-light '><i className="bi bi-chat-left-text-fill fs-4"></i></button>

                                    <h3 className='mb-3 text-muted'>Incidencias</h3>

                                    <div className='table-responsive'>
                                        <div id='SECC_TABLA_INCIDENCIAS'>
                                            <table id='TABLA_INCIDENCIAS' className='table table-striped'>
                                            </table>
                                        </div>
                                    </div>


                                </CCardBody>
                            </CCard >
                        </CCol>
                    </CRow>
                </>

            ) : (
                ""
            )}



            <CModal size="lg" backdrop="static" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Nueva Incidencia</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='col-12'>
                        <h5>Incidencia</h5>
                        <input id='IND_INCIDENCIA' placeholder='...' type="text" className='form-control' />
                        <h5>Detalle</h5>
                        <textarea placeholder='...' name="" id="IND_DETALLE" cols="30" rows="5" className='form-control'></textarea>

                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Cerrar
                    </CButton>
                    <CButton onClick={Agregar_Incidencia} color="primary" className='fw-bold text-light'>
                        Guardar
                    </CButton>

                </CModalFooter>
            </CModal>

            <CModal size="lg" backdrop="static" visible={visibledet} onClose={() => setVisibledet(false)}>
                <CModalHeader>
                    <CModalTitle>Detalles</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='col-12'>
                        <h5>Fecha</h5>
                        <h6 id='FECHA_DET'>{INC_DET_FECHA}</h6>
                        <h5>Incidencia</h5>
                        <input defaultValue={INC_DET_NOM} disabled id='IND_INCIDENCIA_DET' placeholder='...' type="text" className='form-control' />
                        <h5>Detalle</h5>
                        <textarea defaultValue={INC_DET} disabled placeholder='...' name="" id="IND_DETALLE_DET" cols="30" rows="5" className='form-control'></textarea>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibledet(false)}>
                        Cerrar
                    </CButton>
                </CModalFooter>
            </CModal>

        </>

    );
}

export default Incidencias

