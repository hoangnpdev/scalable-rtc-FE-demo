import styles from './register.module.css';
import {useForm} from 'react-hook-form';

function Register() {

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const registerAccount = (data) => {
        fetch('http://localhost:8080/account:register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
            .then(body => {
                window.alert(JSON.stringify(body));
            })
    }
    return (
        <>
            <div className={styles.container}>
                <form onSubmit={handleSubmit(data => {
                    registerAccount(data)
                })}>
                    <div>
                        <label>Account name:</label>
                        <input type={'text'} {...register('accountName', {required: true})} />
                        {errors.accountName && <p className={'text-danger'}>accountName required</p>}
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type={'password'} {...register('password', {required: true})} />
                        {errors.password && <p className={'text-danger'}>password required</p>}
                    </div>
                    <div>
                        <label>Retyped Password:</label>
                        <input type={'password'} {...register('confirmationPassword', {required: true})}/>
                        {errors.confirmationPassword && <p className={'text-danger'}>password unmatched</p>}
                    </div>
                    <button type={'submit'}>register
                    </button>
                </form>
            </div>
        </>
    )
}


export default Register;