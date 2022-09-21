import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function FeaturedPost(props) {
    const {post} = props;

    return (
        <Grid item xs={12} md={6}>

            <Card sx={{display: 'flex'}}>
                <CardContent sx={{flex: 1}}>
                    <Typography component="h2" variant="h5" style={{fontFamily: "chivo"}}>
                        {post.title}
                    </Typography>
                    <Typography variant="subtitle1" color="#DB8A9F">
                        {post.type}
                    </Typography>
                    <Typography variant="subtitle1" paragraph style={{fontFamily: "roboto"}}>
                        {post.description}
                    </Typography>
                </CardContent>
                <CardMedia
                    component="img"
                    sx={{width: "20vh", height: "30vh", display: {xs: 'none', sm: 'block'}}}
                    image={post.image}
                    alt={post.imageLabel}
                />
            </Card>

        </Grid>
    );
}

export default FeaturedPost;
