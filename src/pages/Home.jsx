import React, { Component } from 'react';
import Axios from 'axios';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

// import objData from './staticData'

class Home extends Component {
    state = {
        dataProducts : [],
        dataFurStyle : [],
        initialDataProd : [],
        filterName : '',
        filterStyle : false,
        filterTime : false,
    }
    componentDidMount(){
        this.fetchApi()
    }
    
    fetchApi = ()=>{
        Axios.get('http://www.mocky.io/v2/5c9105cb330000112b649af8').then(res =>{
            this.setState({
                dataProducts : res.data.products,
                dataFurStyle : res.data.furniture_styles,
                initialDataProd : res.data.products,
            })
        }).catch(err=>{console.log(err)})
    }
    
    handleNameChange = (e) =>{
        this.setState({filterName : e.target.value.toLowerCase()}, ()=>{
           this.functFilterName()
        })
    }

    functFilterName = ()=>{
        var searchName = this.state.filterName
        if (searchName.length !== 0) {
            const data =this.state.initialDataProd.filter(res=>  res.name.toLowerCase().includes(searchName))
            this.setState({dataProducts : data})
        }else{
            this.setState({dataProducts : this.state.initialDataProd})
        }
    }

    onChangeSel = (opt, a)=>{
        if (opt !== null) {
            this.setState({filterStyle : true})
        }else{
            this.setState({filterStyle : false})
        }

        if (opt) {
            var dataToLoop = this.state.filterTime? this.state.dataProducts : this.state.initialDataProd
            if (a.action === 'select-option') {
                const fillData = dataToLoop.filter(res=> opt.every(i => res.furniture_style.includes(i.value)) )
                this.setState({dataProducts : fillData})
                // console.log(fillData)
            }
            if (a.action === 'remove-value') {
                const fillData = dataToLoop.filter(res=> opt.every(i => res.furniture_style.includes(i.value)) )
                this.setState({dataProducts : fillData})
                // console.log(fillData)
            }
            if (a.action === 'clear') {
                this.setState({dataProducts : this.state.initialDataProd})
            }
        }else{
            this.setState({dataProducts : this.state.initialDataProd})
        }  
    }

    

    onChangeSelTime = (opt, a)=>{
        if (opt !== null) {
            this.setState({filterTime : true})
        }else{
            this.setState({filterTime : false})
        }
        if (opt) {
            var dataToLoop = this.state.filterStyle? this.state.dataProducts : this.state.initialDataProd
            // if (a.action === 'select-option') {
            const fillData = dataToLoop.filter(res=>  res.delivery_time <= opt.value)
            this.setState({dataProducts : fillData})
                // console.log(fillData)
            // }
            // if (a.action === 'remove-value') {
            //     const fillData = dataToLoop.filter(res=> opt.every(i => res.delivery_time <= i.value) )
            //     this.setState({dataProducts : fillData})
            //     // console.log(fillData)
            // }
            // if (a.action === 'clear') {
            //     this.setState({dataProducts : this.state.initialDataProd})
            // }
        }else{
            this.setState({dataProducts : this.state.initialDataProd})
        }  
    }
    
    styleOpt = ()=>{
        return this.state.dataFurStyle.map(res => ({value : res, label : res }))
    }

    cardsComp = () =>{
        return this.state.dataProducts.map((res,i)=>{
            const {name, price, description, furniture_style, delivery_time} = res
            return(
                <div className="col-md-6" key={i}>
                    <div className="card_prod">
                        <div className="header_card">
                            <p className="name">{name}</p>
                            <p className="price">Rp {price}</p>
                        </div>
                        <p className="desc">
                            {description.length > 114 ? description.substring(0,114) + '...' : description.substring(0,114) }
                        </p>
                        <div className="f_style text-primary">
                        {
                            furniture_style?
                            furniture_style.map((result,i)=> <p key={i}>{result}</p>)
                            : null
                        }
                        </div>
                        <div className="del_day">
                            <p className="text-primary"><u>{delivery_time} Days</u></p>
                        </div>
                    </div>
                </div>
            )
        })
    }

    render() {
        const optTime = [
            {label : '<1 Week', value : 7},
            {label : '<2 Week', value : 12},
            {label : '<1 Month', value : 31},
            {label : 'more', value : 365},
        ]
        return (
            <div className='home container-md'>
                <div className="header p-3">
                    <div className="row">
                        <div className="col-md-6">
                            <input 
                            placeholder='Search Furniture'
                            className='inp_name' 
                            name='name'
                            onChange={this.handleNameChange}
                            type="text" />
                        </div>

                        <div className="col-md-6"></div>

                        <div className="col-md-6">
                            <Select
                            name = 'style_fur'
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            placeholder='Furniture Style'
                            // defaultValue={[colourOptions[4], colourOptions[5]]}
                            onChange={this.onChangeSel}
                            isMulti
                            options={this.styleOpt()}
                            />
                            <hr/>
                        </div>

                        <div className="col-md-6">
                        <Select
                            name = 'day_del'
                            isClearable
                            placeholder='Delivery Time'
                            onChange={this.onChangeSelTime}
                            options={optTime}
                            />
                            <hr/>
                        </div>

                    </div>
                </div>

                <div className="cards_contain row p-3">
                    {
                        this.cardsComp()
                    }
                </div>
                
            </div>
        );
    }
}

export default Home;