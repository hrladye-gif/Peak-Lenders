interface Props{
    title:string;
    value:string;
    subtitle:string;
}

export default function StatCard({
    title,
    value,
    subtitle
}:Props){

    return(
        <div className="stat-card">

            <h3>{title}</h3>

            <p>{value}</p>

            <small>{subtitle}</small>

        </div>
    );
}