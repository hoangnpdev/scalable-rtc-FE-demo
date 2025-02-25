import styles from './login.module.css';
import {useForm} from 'react-hook-form';

function Login() {
    const {
        register, handleSubmit, formState: {errors}
    } = useForm();
    const login = (data) => {
        fetch("http://localhost:8080/account:login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.text())
            .then(body => {
                localStorage.setItem('session', body);
                window.alert(JSON.stringify(body));
            })
    }
    return (<>
            <div className={'container'}>
                <form onSubmit={handleSubmit(data => login(data))}>
                    <div>
                        <label>Account name:</label>
                        <input type={'text'} {...register('accountName', {required: true})} />
                        {errors.accountName && <p className={'text-danger'}>Account name required</p>}
                    </div>
                    <div>
                        <label>Account name:</label>
                        <input type={'text'} {...register('password', {required: true})} />
                        {errors.password && <p className={'text-danger'}>Password required</p>}
                    </div>
                    <button type={'submit'}>Login</button>
                </form>
            </div>
        </>)
}

export default Login;